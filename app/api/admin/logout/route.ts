import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/auth";

export async function POST() {
  try {
    await deleteSession();
    return NextResponse.json({ data: { success: true }, error: null });
  } catch {
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
