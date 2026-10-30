import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createBookingInquiryEntry, getCompanyProfile } from "@/lib/db";
import { verifySession } from "@/lib/auth";
import {
  bookingConfirmationEmail,
  createEmailBrand,
  getResendClient,
  getDefaultFromEmail,
} from "@/lib/email";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const authed = await verifySession();
    if (!authed) {
      return NextResponse.json(
        { data: null, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const inquiries = await prisma.bookingInquiry.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: inquiries, error: null });
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    return NextResponse.json(
      { data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}

const BookingInquiryFormSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(7),
  email: z.string().email().optional().or(z.literal("")),
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

    const { name, phone, email, service, preferredDate, preferredTime, message } = parsed.data;

    const result = await createBookingInquiryEntry({
      name,
      phone,
      email: email || undefined,
      service,
      preferredDate,
      preferredTime,
      message,
    });

    if (result.success) {
      // Fire-and-forget confirmation email dispatch
      (async () => {
        try {
          const resend = getResendClient();
          if (!resend) return;

          const company = await getCompanyProfile();
          const brand = createEmailBrand(company || undefined);

          // 1. Send confirmation to the client if email was provided
          if (email) {
            const clientTemplate = bookingConfirmationEmail(
              {
                customerName: name,
                service,
                date: preferredDate,
                time: preferredTime,
                notes: message,
              },
              brand
            );

            await resend.emails.send({
              from: getDefaultFromEmail(),
              to: email,
              replyTo: "bookings@kandsbeauty.com.np",
              subject: clientTemplate.subject,
              html: clientTemplate.html,
              text: clientTemplate.text,
            });
          }

          // 2. Send notification to the salon owner if business email is configured
          const notifyRecipient = process.env.ADMIN_NOTIFICATION_EMAIL || company?.email;
          if (notifyRecipient && notifyRecipient !== email) {
            await resend.emails.send({
              from: getDefaultFromEmail(),
              to: notifyRecipient,
              subject: `New Booking Inquiry: ${service} - ${name}`,
              text: `New booking request received:\n\nCustomer: ${name}\nPhone: ${phone}\nEmail: ${email || "N/A"}\nService: ${service}\nDate: ${preferredDate}\nTime: ${preferredTime}\nMessage: ${message || "N/A"}`,
            });
          }
        } catch (err) {
          console.error("Failed to dispatch booking emails via Resend:", err);
        }
      })();

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
