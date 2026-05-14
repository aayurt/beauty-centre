import { prisma } from "./prisma";

export async function createContactEntry(data: {
  name: string;
  email: string;
  message: string;
}) {
  if (!process.env.DATABASE_URL) {
    console.warn("Cannot save contact: DATABASE_URL is not configured");
    return { success: false, error: "Database not configured" };
  }

  try {
    const result = await prisma.contact.create({
      data: {
        name: data.name,
        email: data.email,
        message: data.message,
      },
    });
    return { success: true, data: result };
  } catch (error) {
    console.error("Database error:", error);
    return { success: false, error: "Failed to save contact" };
  }
}

export async function createBookingInquiryEntry(data: {
  name: string;
  phone: string;
  service: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
}) {
  if (!process.env.DATABASE_URL) {
    console.warn("Cannot save booking inquiry: DATABASE_URL is not configured");
    return { success: false, error: "Database not configured" };
  }

  try {
    const result = await prisma.bookingInquiry.create({
      data: {
        name: data.name,
        phone: data.phone,
        service: data.service,
        preferredDate: new Date(data.preferredDate),
        preferredTime: data.preferredTime,
        message: data.message,
      },
    });
    return { success: true, data: result };
  } catch (error) {
    console.error("Database error:", error);
    return { success: false, error: "Failed to save booking inquiry" };
  }
}
