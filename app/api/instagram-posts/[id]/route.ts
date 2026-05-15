import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { z } from "zod";

const UpdatePostSchema = z.object({
  postUrl: z.string().url().optional(),
  caption: z.string().optional(),
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
    const parsed = UpdatePostSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return NextResponse.json(
        { data: null, error: "Validation failed", fieldErrors: errors },
        { status: 400 }
      );
    }

    const existing = await prisma.instagramPost.findUnique({
      where: { id: Number(id) },
    });
    if (!existing) {
      return NextResponse.json(
        { data: null, error: "Post not found" },
        { status: 404 }
      );
    }

    const post = await prisma.instagramPost.update({
      where: { id: Number(id) },
      data: parsed.data,
    });

    return NextResponse.json({ data: post, error: null });
  } catch (error) {
    console.error("Failed to update Instagram post:", error);
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

    const existing = await prisma.instagramPost.findUnique({
      where: { id: Number(id) },
    });
    if (!existing) {
      return NextResponse.json(
        { data: null, error: "Post not found" },
        { status: 404 }
      );
    }

    await prisma.instagramPost.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ data: { success: true }, error: null });
  } catch (error) {
    console.error("Failed to delete Instagram post:", error);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
