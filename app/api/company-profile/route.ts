import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { z } from "zod";

const UpdateProfileSchema = z.object({
  name: z.string().min(1).optional(),
  tagline: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  address: z.string().min(1).optional(),
  phone: z.string().nullable().optional(),
  email: z.string().email().optional(),
  hours: z.string().nullable().optional(),
  logo: z.string().nullable().optional(),
  instagram: z.string().nullable().optional(),
  facebook: z.string().nullable().optional(),
  x: z.string().nullable().optional(),
  socialEnabled: z.boolean().optional(),
  instagramEnabled: z.boolean().optional(),
  facebookEnabled: z.boolean().optional(),
  xEnabled: z.boolean().optional(),
});

export async function GET() {
  try {
    let profile = await prisma.companyProfile.findFirst();

    if (!profile) {
      profile = await prisma.companyProfile.create({
        data: {
          name: "K & S Beauty Centre",
          email: "hello@ksbeautycentre.com",
          address: "Jamal, Kathmandu 44600\nNepal",
          phone: "+977-1-4XXXXXX",
          hours: "Monday - Friday: 9:00 AM - 8:00 PM\nSaturday: 9:00 AM - 6:00 PM\nSunday: 10:00 AM - 4:00 PM",
          tagline: "Crafting Beauty, One Client at a Time",
        },
      });
    }

    return NextResponse.json({ data: profile, error: null });
  } catch (error) {
    console.error("Failed to fetch company profile:", error);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authed = await verifySession();
    if (!authed) {
      return NextResponse.json(
        { data: null, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = UpdateProfileSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return NextResponse.json(
        { data: null, error: "Validation failed", fieldErrors: errors },
        { status: 400 }
      );
    }

    const existing = await prisma.companyProfile.findFirst();
    if (!existing) {
      return NextResponse.json(
        { data: null, error: "Company profile not found" },
        { status: 404 }
      );
    }

    const profile = await prisma.companyProfile.update({
      where: { id: existing.id },
      data: parsed.data,
    });

    return NextResponse.json({ data: profile, error: null });
  } catch (error) {
    console.error("Failed to update company profile:", error);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
