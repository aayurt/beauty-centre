import { NextRequest, NextResponse } from "next/server";
import { createBookingInquiryEntry } from "@/lib/db";
import { z } from "zod";

const BookingInquiryFormSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(7),
  service: z.string().min(1),
  preferredDate: z.string().min(1),
  preferredTime: z.string().min(1),
  message: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = BookingInquiryFormSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return NextResponse.json(
        { data: null, error: "Validation failed", fieldErrors: errors },
        { status: 400 }
      );
    }

    const { name, phone, service, preferredDate, preferredTime, message } = parsed.data;

    const result = await createBookingInquiryEntry({
      name,
      phone,
      service,
      preferredDate,
      preferredTime,
      message,
    });

    if (result.success) {
      return NextResponse.json(
        { data: { message: "Booking inquiry saved successfully" }, error: null },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { data: null, error: "Failed to save booking inquiry" },
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
