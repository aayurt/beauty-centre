import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { z } from "zod";

export const dynamic = "force-dynamic";

const ProductSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  brand: z.string().optional(),
  category: z.string().min(1, "Category is required").optional(),
  description: z.string().optional(),
  price: z.string().optional(),
  imageUrl: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().optional(),
});

async function getId(params: Promise<{ id: string }>): Promise<number | null> {
  const { id } = await params;
  const parsed = Number(id);
  return Number.isNaN(parsed) ? null : parsed;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = await getId(params);
    if (id === null) {
      return NextResponse.json({ data: null, error: "Invalid product ID" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json({ data: null, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ data: product, error: null });
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authed = await verifySession();
    if (!authed) {
      return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 });
    }

    const id = await getId(params);
    if (id === null) {
      return NextResponse.json({ data: null, error: "Invalid product ID" }, { status: 400 });
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

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ data: null, error: "Product not found" }, { status: 404 });
    }

    const product = await prisma.product.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ data: product, error: null });
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authed = await verifySession();
    if (!authed) {
      return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 });
    }

    const id = await getId(params);
    if (id === null) {
      return NextResponse.json({ data: null, error: "Invalid product ID" }, { status: 400 });
    }

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ data: null, error: "Product not found" }, { status: 404 });
    }

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ data: { success: true }, error: null });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 },
    );
  }
}
