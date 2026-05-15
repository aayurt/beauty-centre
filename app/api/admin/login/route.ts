import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/auth";
import { verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const LoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = LoginSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return NextResponse.json(
        { data: null, error: "Validation failed", fieldErrors: errors },
        { status: 400 }
      );
    }

    const { username, password } = parsed.data;

    const user = await prisma.adminUser.findUnique({
      where: { username },
    });

    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json(
        { data: null, error: "Invalid username or password" },
        { status: 401 }
      );
    }

    await createSession(user.id);

    return NextResponse.json({ data: { success: true }, error: null });
  } catch {
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
