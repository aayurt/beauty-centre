import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { z } from "zod";

const AddMediaSchema = z.object({
  imageUrl: z.string().min(1, "Image URL is required"),
  alt: z.string().optional().default(""),
  caption: z.string().optional().default(""),
  displayOrder: z.number().int().optional().default(0),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const eventId = parseInt(id, 10);

    if (isNaN(eventId)) {
      return NextResponse.json(
        { data: null, error: "Invalid event ID" },
        { status: 400 }
      );
    }

    const media = await prisma.media.findMany({
      where: { eventId },
      orderBy: { displayOrder: "asc" },
    });

    return NextResponse.json({ data: media, error: null });
  } catch (error) {
    console.error("Failed to fetch media:", error);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
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
    const eventId = parseInt(id, 10);

    if (isNaN(eventId)) {
      return NextResponse.json(
        { data: null, error: "Invalid event ID" },
        { status: 400 }
      );
    }

    const existing = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!existing) {
      return NextResponse.json(
        { data: null, error: "Event not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const parsed = AddMediaSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return NextResponse.json(
        { data: null, error: "Validation failed", fieldErrors: errors },
        { status: 400 }
      );
    }

    const { imageUrl, alt, caption, displayOrder } = parsed.data;

    const mediaItem = await prisma.media.create({
      data: {
        imageUrl,
        alt: alt || null,
        caption: caption || null,
        eventId,
        displayOrder,
      },
    });

    return NextResponse.json({ data: mediaItem, error: null }, { status: 201 });
  } catch (error) {
    console.error("Failed to add media:", error);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
