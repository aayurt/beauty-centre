import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const businessInfo = await prisma.businessInfo.findFirst({
      orderBy: { id: "asc" },
    });

    if (!businessInfo) {
      return NextResponse.json(
        { data: null, error: "Business info not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: businessInfo, error: null });
  } catch (error) {
    console.error("Failed to fetch business info:", error);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
