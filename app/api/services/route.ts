import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { z } from "zod";

const ServiceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  price: z.string().optional().default(""),
  description: z.string().optional().default(""),
  duration: z.string().optional().default(""),
  iconName: z.string().optional().default("Sparkles"),
  imageUrl: z.string().nullable().optional().default(null),
  features: z.array(z.string()).optional().default([]),
  displayOrder: z.number().optional().default(0),
  isActive: z.boolean().optional().default(true),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("activeOnly") !== "false";

    const where = activeOnly ? { isActive: true } : {};

    const services = await prisma.service.findMany({
      where,
      orderBy: [{ displayOrder: "asc" }, { id: "asc" }],
    });

    return NextResponse.json({ data: services, error: null });
  } catch (error) {
    console.error("Failed to fetch services:", error);
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
    const parsed = ServiceSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return NextResponse.json(
        { data: null, error: "Validation failed", fieldErrors: errors },
        { status: 400 }
      );
    }

    const service = await prisma.service.create({
      data: parsed.data,
    });

    return NextResponse.json({ data: service, error: null }, { status: 201 });
  } catch (error) {
    console.error("Failed to create service:", error);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
