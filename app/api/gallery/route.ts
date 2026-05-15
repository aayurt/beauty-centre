import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { z } from "zod";

const CreateGallerySchema = z.object({
  src: z.string().min(1, "Image URL is required"),
  alt: z.string().optional().default(""),
  span: z.string().optional().default(""),
  displayOrder: z.number().optional().default(0),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("activeOnly") !== "false";

    const where = activeOnly ? { isActive: true } : {};

    const items = await prisma.galleryItem.findMany({
      where,
      orderBy: { displayOrder: "asc" },
    });

    return NextResponse.json({ data: items, error: null });
  } catch (error) {
    console.error("Failed to fetch gallery:", error);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authed = await verifySession();
    if (!authed) {
      return NextResponse.json(
        { data: null, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = CreateGallerySchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return NextResponse.json(
        { data: null, error: "Validation failed", fieldErrors: errors },
        { status: 400 }
      );
    }

    const { src, alt, span, displayOrder } = parsed.data;

    const item = await prisma.galleryItem.create({
      data: { src, alt: alt || "", span: span || "", displayOrder },
    });

    return NextResponse.json({ data: item, error: null }, { status: 201 });
  } catch (error) {
    console.error("Failed to create gallery item:", error);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
