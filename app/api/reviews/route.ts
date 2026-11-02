import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { z } from "zod";

export const dynamic = "force-dynamic";

const CreateReviewSchema = z.object({
  name: z.string().min(1, "Name is required"),
  rating: z.number().int().min(1).max(5).default(5),
  text: z.string().min(1, "Review text is required"),
  service: z.string().optional().nullable(),
  displayOrder: z.number().optional().default(0),
  isActive: z.boolean().optional().default(true),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("activeOnly") === "true";

    const where = activeOnly ? { isActive: true } : {};

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { displayOrder: "asc" },
    });

    return NextResponse.json({ data: reviews, error: null });
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
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
    const parsed = CreateReviewSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return NextResponse.json(
        { data: null, error: "Validation failed", fieldErrors: errors },
        { status: 400 }
      );
    }

    const { name, rating, text, service, displayOrder, isActive } = parsed.data;

    const review = await prisma.review.create({
      data: {
        name,
        rating,
        text,
        service: service || null,
        displayOrder,
        isActive,
      },
    });

    return NextResponse.json({ data: review, error: null }, { status: 201 });
  } catch (error) {
    console.error("Failed to create review:", error);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
