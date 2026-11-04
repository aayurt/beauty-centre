import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/avif", "image/gif"];

function ensureUploadDir() {
  fs.mkdir(UPLOAD_DIR, { recursive: true }).catch(() => {
    // directory may already exist
  });
}

export async function POST(request: NextRequest) {
  try {
    const authed = await verifySession();
    if (!authed) {
      return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 });
    }

    ensureUploadDir();

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ data: null, error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { data: null, error: "Unsupported file type. Use PNG, JPG, WebP, GIF, or AVIF." },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    if (arrayBuffer.byteLength > MAX_FILE_SIZE) {
      return NextResponse.json(
        { data: null, error: "File too large. Maximum 5MB." },
        { status: 400 },
      );
    }

    const ext = path.extname(file.name || "").toLowerCase() || ".webp";
    const baseName = path.basename(file.name || "image", ext).replace(/[^a-z0-9_-]/gi, "_");
    const fileName = `${baseName}-${crypto.randomBytes(8).toString("hex")}.webp`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    const buffer = Buffer.from(arrayBuffer);

    // Compress: convert to WebP, quality 80, cap max dimension at 1600px
    await sharp(buffer)
      .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(filePath);

    const url = `/uploads/${fileName}`;

    return NextResponse.json({ data: { url }, error: null }, { status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 },
    );
  }
}
