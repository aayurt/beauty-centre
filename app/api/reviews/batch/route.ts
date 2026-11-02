import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { z } from "zod";

export const dynamic = "force-dynamic";

const ReviewItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  rating: z.number().int().min(1).max(5).default(5),
  text: z.string().min(1, "Review text is required"),
  service: z.string().optional().nullable(),
  isActive: z.boolean().optional().default(true),
});

const ImportBatchSchema = z.object({
  reviews: z.array(ReviewItemSchema).min(1, "At least one review required"),
});

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
    const parsed = ImportBatchSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { data: null, error: "Invalid review items", fieldErrors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const highest = await prisma.review.findFirst({
      orderBy: { displayOrder: "desc" },
      select: { displayOrder: true },
    });
    let currentOrder = (highest?.displayOrder ?? -1) + 1;

    const created = await prisma.$transaction(
      parsed.data.reviews.map((r) =>
        prisma.review.create({
          data: {
            name: r.name.trim(),
            rating: r.rating,
            text: r.text.trim(),
            service: r.service ? r.service.trim() : null,
            isActive: r.isActive ?? true,
            displayOrder: currentOrder++,
          },
        })
      )
    );

    return NextResponse.json({
      data: { count: created.length, reviews: created },
      error: null,
    });
  } catch (error) {
    console.error("Batch import failed:", error);
    return NextResponse.json(
      { data: null, error: "Failed to import reviews" },
      { status: 500 }
    );
  }
}
