import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { z } from "zod";

const UpdateServiceSchema = z.object({
  title: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  price: z.string().optional(),
  description: z.string().optional(),
  duration: z.string().optional(),
  iconName: z.string().optional(),
  imageUrl: z.string().nullable().optional(),
  features: z.array(z.string()).optional(),
  displayOrder: z.number().optional(),
  isActive: z.boolean().optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const service = await prisma.service.findUnique({
      where: { id: Number(id) },
    });

    if (!service) {
      return NextResponse.json(
        { data: null, error: "Service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: service, error: null });
  } catch (error) {
    console.error("Failed to fetch service:", error);
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
    const body = await request.json();
    const parsed = UpdateServiceSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return NextResponse.json(
        { data: null, error: "Validation failed", fieldErrors: errors },
        { status: 400 }
      );
    }

    const existing = await prisma.service.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      return NextResponse.json(
        { data: null, error: "Service not found" },
        { status: 404 }
      );
    }

    const service = await prisma.service.update({
      where: { id: Number(id) },
      data: parsed.data,
    });

    return NextResponse.json({ data: service, error: null });
  } catch (error) {
    console.error("Failed to update service:", error);
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

    const existing = await prisma.service.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      return NextResponse.json(
        { data: null, error: "Service not found" },
        { status: 404 }
      );
    }

    await prisma.service.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ data: { success: true }, error: null });
  } catch (error) {
    console.error("Failed to delete service:", error);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
