import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createContactEntry } from "@/lib/db";
import { verifySession } from "@/lib/auth";
import { z } from "zod";

export async function GET() {
  try {
    const authed = await verifySession();
    if (!authed) {
      return NextResponse.json(
        { data: null, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: contacts, error: null });
  } catch (error) {
    console.error("Failed to fetch contacts:", error);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}

const ContactFormSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = ContactFormSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return NextResponse.json(
        { data: null, error: "Validation failed", fieldErrors: errors },
        { status: 400 }
      );
    }

    const { name, email, message } = parsed.data;

    const result = await createContactEntry({ name, email, message });

    if (result.success) {
      return NextResponse.json(
        { data: { message: "Contact saved successfully" }, error: null },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { data: null, error: "Failed to save contact" },
        { status: 500 }
      );
    }
  } catch {
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
