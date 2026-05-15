import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { z } from "zod";

const UpdateEventSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  date: z.string().optional(),
  time: z.string().optional(),
  location: z.string().optional(),
  imageUrl: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
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

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { media: { orderBy: { displayOrder: "asc" } } },
    });

    if (!event) {
      return NextResponse.json(
        { data: null, error: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: event, error: null });
  } catch (error) {
    console.error("Failed to fetch event:", error);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}

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
    const parsed = UpdateEventSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return NextResponse.json(
        { data: null, error: "Validation failed", fieldErrors: errors },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (parsed.data.title !== undefined) updateData.title = parsed.data.title;
    if (parsed.data.description !== undefined) updateData.description = parsed.data.description;
    if (parsed.data.date !== undefined) updateData.date = new Date(parsed.data.date);
    if (parsed.data.time !== undefined) updateData.time = parsed.data.time || null;
    if (parsed.data.location !== undefined) updateData.location = parsed.data.location || null;
    if (parsed.data.imageUrl !== undefined) updateData.imageUrl = parsed.data.imageUrl || null;
    if (parsed.data.status !== undefined) {
      updateData.status = parsed.data.status;
      updateData.isActive = parsed.data.status === "PUBLISHED";
    }

    const event = await prisma.event.update({
      where: { id: eventId },
      data: updateData,
      include: { media: { orderBy: { displayOrder: "asc" } } },
    });

    return NextResponse.json({ data: event, error: null });
  } catch (error) {
    console.error("Failed to update event:", error);
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

    await prisma.event.delete({ where: { id: eventId } });

    return NextResponse.json({ data: { success: true }, error: null });
  } catch (error) {
    console.error("Failed to delete event:", error);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
