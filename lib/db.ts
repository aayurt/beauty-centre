import { prisma } from "./prisma";
import type { BookingStatus, EventStatus, ReviewSource } from "@prisma/client";

// ─── Contact ─────────────────────────────────────────────────────────────────

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

// ─── Booking Inquiry (legacy) ───────────────────────────────────────────────

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

// ─── Company Profile ─────────────────────────────────────────────────────────

export async function getCompanyProfile() {
  try {
    const profile = await prisma.companyProfile.findFirst();
    return profile;
  } catch (error) {
    console.error("Failed to fetch company profile:", error);
    return null;
  }
}

export async function upsertCompanyProfile(data: {
  name: string;
  email: string;
  address: string;
  phone?: string;
  hours?: string;
  tagline?: string;
  description?: string;
  logo?: string;
  instagram?: string;
  facebook?: string;
  x?: string;
  socialEnabled?: boolean;
  instagramEnabled?: boolean;
  facebookEnabled?: boolean;
  xEnabled?: boolean;
}) {
  try {
    const existing = await prisma.companyProfile.findFirst();
    if (existing) {
      return await prisma.companyProfile.update({
        where: { id: existing.id },
        data,
      });
    }
    return await prisma.companyProfile.create({ data });
  } catch (error) {
    console.error("Failed to upsert company profile:", error);
    throw error;
  }
}

// ─── Events ──────────────────────────────────────────────────────────────────

export async function getEvents(activeOnly = true) {
  try {
    const where = activeOnly ? { isActive: true } : {};
    return await prisma.event.findMany({
      where,
      include: { media: true },
      orderBy: { date: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return [];
  }
}

export async function getEventById(id: number) {
  try {
    return await prisma.event.findUnique({
      where: { id },
      include: { media: true },
    });
  } catch (error) {
    console.error("Failed to fetch event:", error);
    return null;
  }
}

export async function createEvent(data: {
  title: string;
  description?: string;
  date: Date;
  time?: string;
  location?: string;
  imageUrl?: string;
  status?: EventStatus;
}) {
  try {
    const isActive = data.status ? data.status === "PUBLISHED" : true;
    return await prisma.event.create({
      data: { ...data, isActive },
      include: { media: true },
    });
  } catch (error) {
    console.error("Failed to create event:", error);
    throw error;
  }
}

export async function updateEvent(
  id: number,
  data: {
    title?: string;
    description?: string;
    date?: Date;
    time?: string;
    location?: string;
    imageUrl?: string;
    status?: EventStatus;
  }
) {
  try {
    const updateData: Record<string, unknown> = { ...data };
    if (data.status) {
      updateData.isActive = data.status === "PUBLISHED";
    }
    return await prisma.event.update({
      where: { id },
      data: updateData,
      include: { media: true },
    });
  } catch (error) {
    console.error("Failed to update event:", error);
    throw error;
  }
}

export async function deleteEvent(id: number) {
  try {
    await prisma.event.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    console.error("Failed to delete event:", error);
    throw error;
  }
}

// ─── Media ───────────────────────────────────────────────────────────────────

export async function getMedia(eventId?: number) {
  try {
    const where = eventId ? { eventId } : {};
    return await prisma.media.findMany({
      where,
      orderBy: { displayOrder: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch media:", error);
    return [];
  }
}

export async function createMedia(data: {
  imageUrl: string;
  alt?: string;
  caption?: string;
  eventId?: number;
  displayOrder?: number;
}) {
  try {
    return await prisma.media.create({ data });
  } catch (error) {
    console.error("Failed to create media:", error);
    throw error;
  }
}

export async function updateMedia(
  id: number,
  data: {
    imageUrl?: string;
    alt?: string;
    caption?: string;
    displayOrder?: number;
  }
) {
  try {
    return await prisma.media.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.error("Failed to update media:", error);
    throw error;
  }
}

export async function deleteMedia(id: number) {
  try {
    await prisma.media.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    console.error("Failed to delete media:", error);
    throw error;
  }
}

// ─── Staff ───────────────────────────────────────────────────────────────────

export async function getStaff(activeOnly = true) {
  try {
    const where = activeOnly ? { isActive: true } : {};
    return await prisma.staff.findMany({
      where,
      orderBy: { displayOrder: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch staff:", error);
    return [];
  }
}

export async function createStaff(data: {
  name: string;
  role?: string;
  bio?: string;
  imageUrl?: string;
  displayOrder?: number;
}) {
  try {
    return await prisma.staff.create({ data });
  } catch (error) {
    console.error("Failed to create staff:", error);
    throw error;
  }
}

// ─── Booking ─────────────────────────────────────────────────────────────────

export async function createBooking(data: {
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  service: string;
  preferredDate: Date;
  preferredTime: string;
  message?: string;
}) {
  if (!process.env.DATABASE_URL) {
    console.warn("Cannot create booking: DATABASE_URL is not configured");
    return { success: false, error: "Database not configured" };
  }

  try {
    const result = await prisma.booking.create({
      data: {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        service: data.service,
        preferredDate: data.preferredDate,
        preferredTime: data.preferredTime,
        message: data.message,
      },
    });
    return { success: true, data: result };
  } catch (error) {
    console.error("Database error:", error);
    return { success: false, error: "Failed to create booking" };
  }
}

export async function getBookings(statusFilter?: BookingStatus) {
  try {
    const where = statusFilter ? { status: statusFilter } : {};
    return await prisma.booking.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    return [];
  }
}

export async function updateBookingStatus(
  id: number,
  status: BookingStatus
) {
  try {
    return await prisma.booking.update({
      where: { id },
      data: { status },
    });
  } catch (error) {
    console.error("Failed to update booking status:", error);
    throw error;
  }
}

// ─── Client Reviews ──────────────────────────────────────────────────────────

export async function getClientReviews(activeOnly = true) {
  try {
    const where = activeOnly ? { isActive: true } : {};
    return await prisma.clientReview.findMany({
      where,
      orderBy: { displayOrder: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch client reviews:", error);
    return [];
  }
}

export async function createClientReview(data: {
  source: ReviewSource;
  rating: number;
  text: string;
  author: string;
  photo?: string;
  service?: string;
  displayOrder?: number;
}) {
  try {
    return await prisma.clientReview.create({ data });
  } catch (error) {
    console.error("Failed to create client review:", error);
    throw error;
  }
}

// ─── Privacy Policy ──────────────────────────────────────────────────────────

export async function getCurrentPrivacyPolicy() {
  try {
    return await prisma.privacyPolicy.findFirst({
      where: { isLatest: true },
      orderBy: { version: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch privacy policy:", error);
    return null;
  }
}

export async function createPrivacyPolicyVersion(data: {
  body: string;
  publishedAt?: Date;
}) {
  try {
    const latest = await prisma.privacyPolicy.findFirst({
      where: { isLatest: true },
      orderBy: { version: "desc" },
    });

    const nextVersion = latest ? latest.version + 1 : 1;

    await prisma.privacyPolicy.updateMany({
      where: { isLatest: true },
      data: { isLatest: false },
    });

    return await prisma.privacyPolicy.create({
      data: {
        body: data.body,
        version: nextVersion,
        isLatest: true,
        publishedAt: data.publishedAt ?? new Date(),
      },
    });
  } catch (error) {
    console.error("Failed to create privacy policy version:", error);
    throw error;
  }
}

// ─── Terms of Service ────────────────────────────────────────────────────────

export async function getCurrentTermsOfService() {
  try {
    return await prisma.termsOfService.findFirst({
      where: { isLatest: true },
      orderBy: { version: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch terms of service:", error);
    return null;
  }
}

export async function createTermsOfServiceVersion(data: {
  body: string;
  publishedAt?: Date;
}) {
  try {
    const latest = await prisma.termsOfService.findFirst({
      where: { isLatest: true },
      orderBy: { version: "desc" },
    });

    const nextVersion = latest ? latest.version + 1 : 1;

    await prisma.termsOfService.updateMany({
      where: { isLatest: true },
      data: { isLatest: false },
    });

    return await prisma.termsOfService.create({
      data: {
        body: data.body,
        version: nextVersion,
        isLatest: true,
        publishedAt: data.publishedAt ?? new Date(),
      },
    });
  } catch (error) {
    console.error("Failed to create terms of service version:", error);
    throw error;
  }
}
