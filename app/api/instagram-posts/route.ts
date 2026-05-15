import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { z } from "zod";

const CreatePostSchema = z.object({
  postUrl: z.string().url("Must be a valid URL"),
  caption: z.string().optional(),
  displayOrder: z.number().optional().default(0),
});

export async function GET() {
  try {
    const posts = await prisma.instagramPost.findMany({
      orderBy: { displayOrder: "asc" },
    });
    return NextResponse.json({ data: posts, error: null });
  } catch (error) {
    console.error("Failed to fetch Instagram posts:", error);
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
    const parsed = CreatePostSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return NextResponse.json(
        { data: null, error: "Validation failed", fieldErrors: errors },
        { status: 400 }
      );
    }

    const { postUrl, caption, displayOrder } = parsed.data;

    const maxOrder = await prisma.instagramPost.aggregate({
      _max: { displayOrder: true },
    });
    const nextOrder = (maxOrder._max.displayOrder ?? -1) + 1;

    const post = await prisma.instagramPost.create({
      data: { postUrl, caption, displayOrder: displayOrder ?? nextOrder },
    });

    return NextResponse.json({ data: post, error: null }, { status: 201 });
  } catch (error) {
    console.error("Failed to create Instagram post:", error);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
