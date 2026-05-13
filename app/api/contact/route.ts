import { NextRequest, NextResponse } from "next/server";
import { createContactEntry } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Save to database
    const result = await createContactEntry({ name, email, message });

    if (result.success) {
      return NextResponse.json(
        { message: "Contact saved successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Failed to save contact" },
        { status: 500 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}