import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { z } from "zod";

const CreateStaffSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().optional().default(""),
  bio: z.string().optional().default(""),
  imageUrl: z.string().optional().default(""),
  displayOrder: z.number().optional().default(0),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("activeOnly") !== "false";

    const where = activeOnly ? { isActive: true } : {};

    const staff = await prisma.staff.findMany({
      where,
      orderBy: { displayOrder: "asc" },
    });

    return NextResponse.json({ data: staff, error: null });
  } catch (error) {
    console.error("Failed to fetch staff:", error);
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
    const parsed = CreateStaffSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return NextResponse.json(
        { data: null, error: "Validation failed", fieldErrors: errors },
        { status: 400 }
      );
    }

    const { name, role, bio, imageUrl, displayOrder } = parsed.data;

    const staff = await prisma.staff.create({
      data: {
        name,
        role: role || null,
        bio: bio || null,
        imageUrl: imageUrl || null,
        displayOrder,
      },
    });

    return NextResponse.json({ data: staff, error: null }, { status: 201 });
  } catch (error) {
    console.error("Failed to create staff:", error);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
