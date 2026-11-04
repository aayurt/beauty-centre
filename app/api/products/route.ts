import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { z } from "zod";

export const dynamic = "force-dynamic";

const ProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  brand: z.string().optional().default(""),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional().default(""),
  price: z.string().optional().default(""),
  imageUrl: z.string().nullable().optional().default(null),
  isActive: z.boolean().optional().default(true),
  displayOrder: z.number().optional().default(0),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("activeOnly") !== "false";

    const where = activeOnly ? { isActive: true } : {};

    const products = await prisma.product.findMany({
      where,
      orderBy: [{ displayOrder: "asc" }, { id: "asc" }],
    });

    return NextResponse.json({ data: products, error: null });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authed = await verifySession();
    if (!authed) {
      return NextResponse.json(
        { data: null, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const parsed = ProductSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return NextResponse.json(
        { data: null, error: "Validation failed", fieldErrors: errors },
        { status: 400 },
      );
    }

    const product = await prisma.product.create({
      data: parsed.data,
    });

    return NextResponse.json({ data: product, error: null }, { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 },
    );
  }
}
