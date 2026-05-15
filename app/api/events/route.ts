import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { z } from "zod";

const CreateEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().default(""),
  date: z.string().min(1, "Date is required"),
  time: z.string().optional().default(""),
  location: z.string().optional().default(""),
  imageUrl: z.string().optional().default(""),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional().default("DRAFT"),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("activeOnly") !== "false";
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};
    if (activeOnly) {
      where.isActive = true;
    }
    if (status) {
      where.status = status;
    }

    const events = await prisma.event.findMany({
      where,
      include: { media: { orderBy: { displayOrder: "asc" } } },
      orderBy: { date: "asc" },
    });

    return NextResponse.json({ data: events, error: null });
  } catch (error) {
    console.error("Failed to fetch events:", error);
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
    const parsed = CreateEventSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return NextResponse.json(
        { data: null, error: "Validation failed", fieldErrors: errors },
        { status: 400 }
      );
    }

    const { title, description, date, time, location, imageUrl, status } =
      parsed.data;

    const isActive = status === "PUBLISHED";

    const event = await prisma.event.create({
      data: {
        title,
        description: description || "",
        date: new Date(date),
        time: time || null,
        location: location || null,
        imageUrl: imageUrl || null,
        status,
        isActive,
      },
      include: { media: true },
    });

    return NextResponse.json({ data: event, error: null }, { status: 201 });
  } catch (error) {
    console.error("Failed to create event:", error);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
