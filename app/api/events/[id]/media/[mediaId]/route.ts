import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { z } from "zod";

const UpdateMediaSchema = z.object({
  imageUrl: z.string().min(1).optional(),
  alt: z.string().optional(),
  caption: z.string().optional(),
  displayOrder: z.number().int().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; mediaId: string }> }
) {
  try {
    const authed = await verifySession();
    if (!authed) {
      return NextResponse.json(
        { data: null, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id, mediaId } = await params;
    const eventId = parseInt(id, 10);
    const mediaItemId = parseInt(mediaId, 10);

    if (isNaN(eventId) || isNaN(mediaItemId)) {
      return NextResponse.json(
        { data: null, error: "Invalid ID" },
        { status: 400 }
      );
    }

    const existing = await prisma.media.findFirst({
      where: { id: mediaItemId, eventId },
    });

    if (!existing) {
      return NextResponse.json(
        { data: null, error: "Media not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const parsed = UpdateMediaSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return NextResponse.json(
        { data: null, error: "Validation failed", fieldErrors: errors },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (parsed.data.imageUrl !== undefined) updateData.imageUrl = parsed.data.imageUrl;
    if (parsed.data.alt !== undefined) updateData.alt = parsed.data.alt || null;
    if (parsed.data.caption !== undefined) updateData.caption = parsed.data.caption || null;
    if (parsed.data.displayOrder !== undefined) updateData.displayOrder = parsed.data.displayOrder;

    const mediaItem = await prisma.media.update({
      where: { id: mediaItemId },
      data: updateData,
    });

    return NextResponse.json({ data: mediaItem, error: null });
  } catch (error) {
    console.error("Failed to update media:", error);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; mediaId: string }> }
) {
  try {
    const authed = await verifySession();
    if (!authed) {
      return NextResponse.json(
        { data: null, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id, mediaId } = await params;
    const eventId = parseInt(id, 10);
    const mediaItemId = parseInt(mediaId, 10);

    if (isNaN(eventId) || isNaN(mediaItemId)) {
      return NextResponse.json(
        { data: null, error: "Invalid ID" },
        { status: 400 }
      );
    }

    const existing = await prisma.media.findFirst({
      where: { id: mediaItemId, eventId },
    });

    if (!existing) {
      return NextResponse.json(
        { data: null, error: "Media not found" },
        { status: 404 }
      );
    }

    await prisma.media.delete({ where: { id: mediaItemId } });

    return NextResponse.json({ data: { success: true }, error: null });
  } catch (error) {
    console.error("Failed to delete media:", error);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
