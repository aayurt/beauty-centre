import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/auth", () => ({
  verifySession: vi.fn().mockResolvedValue(true),
}));

import { POST } from "../route";

// Mock prisma and db
vi.mock("@/lib/prisma", () => ({
  prisma: {
    bookingInquiry: {
      create: vi.fn().mockResolvedValue({ id: 999 }),
      findMany: vi.fn().mockResolvedValue([]),
    },
  },
}));

vi.mock("@/lib/db", () => ({
  createBookingInquiryEntry: vi.fn().mockResolvedValue({ success: true, data: { id: 999 } }),
  getCompanyProfile: vi.fn().mockResolvedValue({
    name: "K & S Beauty Centre",
    email: "info@ksbeauty.com",
    address: "Jamal, Kathmandu, Nepal",
    phone: "+977-1-4220000",
  }),
}));

describe("POST /api/bookings", () => {
  it("accepts a valid booking submission with email", async () => {
    const req = new NextRequest("http://localhost:3000/api/bookings", {
      method: "POST",
      body: JSON.stringify({
        name: "Aayush Shrestha",
        phone: "9841234567",
        email: "aayurtshrestha@gmail.com",
        service: "Hair Styling & Treatment",
        preferredDate: "2026-11-15",
        preferredTime: "11:00 AM",
        message: "Looking forward to the appointment",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.data.message).toBe("Booking inquiry saved successfully");
    expect(json.error).toBeNull();
  });

  it("fails validation if phone is too short", async () => {
    const req = new NextRequest("http://localhost:3000/api/bookings", {
      method: "POST",
      body: JSON.stringify({
        name: "Test",
        phone: "123",
        service: "Facials",
        preferredDate: "2026-11-15",
        preferredTime: "10:00 AM",
        message: "",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toBe("Validation failed");
    expect(json.fieldErrors.phone).toBeDefined();
  });
});
