import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { z } from "zod";

const UpdateGallerySchema = z.object({
  src: z.string().min(1).optional(),
  alt: z.string().optional(),
  span: z.string().optional(),
  displayOrder: z.number().optional(),
  isActive: z.boolean().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authed = await verifySession();
    if (!authed) {
      return NextResponse.json(
        { data: null, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = UpdateGallerySchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return NextResponse.json(
        { data: null, error: "Validation failed", fieldErrors: errors },
        { status: 400 }
      );
    }

    const existing = await prisma.galleryItem.findUnique({
      where: { id: Number(id) },
    });
    if (!existing) {
      return NextResponse.json(
        { data: null, error: "Gallery item not found" },
        { status: 404 }
      );
    }

    const item = await prisma.galleryItem.update({
      where: { id: Number(id) },
      data: parsed.data,
    });

    return NextResponse.json({ data: item, error: null });
  } catch (error) {
    console.error("Failed to update gallery item:", error);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authed = await verifySession();
    if (!authed) {
      return NextResponse.json(
        { data: null, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const existing = await prisma.galleryItem.findUnique({
      where: { id: Number(id) },
    });
    if (!existing) {
      return NextResponse.json(
        { data: null, error: "Gallery item not found" },
        { status: 404 }
      );
    }

    await prisma.galleryItem.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ data: { success: true }, error: null });
  } catch (error) {
    console.error("Failed to delete gallery item:", error);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
