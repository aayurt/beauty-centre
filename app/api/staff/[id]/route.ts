import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { z } from "zod";

const UpdateStaffSchema = z.object({
  name: z.string().min(1).optional(),
  role: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  displayOrder: z.number().optional(),
  isActive: z.boolean().optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const staff = await prisma.staff.findUnique({
      where: { id: Number(id) },
    });

    if (!staff) {
      return NextResponse.json(
        { data: null, error: "Staff not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: staff, error: null });
  } catch (error) {
    console.error("Failed to fetch staff:", error);
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
    const parsed = UpdateStaffSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return NextResponse.json(
        { data: null, error: "Validation failed", fieldErrors: errors },
        { status: 400 }
      );
    }

    const existing = await prisma.staff.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      return NextResponse.json(
        { data: null, error: "Staff not found" },
        { status: 404 }
      );
    }

    const staff = await prisma.staff.update({
      where: { id: Number(id) },
      data: parsed.data,
    });

    return NextResponse.json({ data: staff, error: null });
  } catch (error) {
    console.error("Failed to update staff:", error);
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

    const existing = await prisma.staff.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      return NextResponse.json(
        { data: null, error: "Staff not found" },
        { status: 404 }
      );
    }

    await prisma.staff.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ data: { success: true }, error: null });
  } catch (error) {
    console.error("Failed to delete staff:", error);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
