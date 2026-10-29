import { describe, expect, it } from "vitest";
import {
  appointmentReminderEmail,
  bookingConfirmationEmail,
  statusUpdateEmail,
} from "../index";

const appointment = {
  customerName: "Aayush Shrestha",
  customerEmail: "aayush@example.com",
  service: "Haircut & Blowout",
  date: "2026-11-07",
  time: "10:00 AM",
  duration: "45 mins",
  price: "NPR 1,200",
  stylist: "Suman",
  bookingReference: "KS-1042",
};

describe("bookingConfirmationEmail", () => {
  it("renders a responsive HTML email with appointment details", () => {
    const email = bookingConfirmationEmail(appointment);

    expect(email.subject).toContain("Booking confirmed");
    expect(email.subject).toContain("Haircut & Blowout");
    expect(email.subject).toContain("Nov 7");
    expect(email.html).toContain("<!DOCTYPE html");
    expect(email.html).toContain('name="viewport"');
    expect(email.html).toContain("@media only screen and (max-width: 620px)");
    expect(email.html).toContain("Saturday, November 7, 2026");
    expect(email.html).toContain("10:00 AM");
    expect(email.html).toContain("Chitra Marg");
    expect(email.html).toContain("24 hours");
    expect(email.html).toContain("K &amp; S");
    expect(email.html).toContain("KS-1042");
  });

  it("renders a plain-text fallback without markup", () => {
    const email = bookingConfirmationEmail(appointment);

    expect(email.text).toContain("Hi Aayush");
    expect(email.text).toContain("Haircut & Blowout");
    expect(email.text).toContain("Saturday, November 7, 2026");
    expect(email.text).toContain("Chitra Marg");
    expect(email.text).toContain("CANCELLATION GUIDELINES");
    expect(email.text).not.toContain("<table");
    expect(email.text).not.toContain("<p");
  });

  it("escapes customer input in HTML", () => {
    const email = bookingConfirmationEmail({
      ...appointment,
      customerName: 'Aayush<script>alert("x")</script>',
      service: 'Cut & Style <b>bold</b>',
    });

    expect(email.html).not.toContain("<script>alert");
    expect(email.html).toContain("&lt;script&gt;");
    expect(email.html).toContain("Cut &amp; Style &lt;b&gt;bold&lt;/b&gt;");
    expect(email.text).toContain("<script>alert");
  });

  it("applies brand overrides", () => {
    const email = bookingConfirmationEmail(appointment, {
      name: "Glow Studio",
      address: "1 Lake Road\nPokhara, Nepal",
      phone: "+977 61 000 000",
      cancellationPolicy: ["Cancel at least 12 hours ahead."],
    });

    expect(email.html).toContain("Glow Studio");
    expect(email.html).toContain("Pokhara, Nepal");
    expect(email.html).toContain("Cancel at least 12 hours ahead.");
    expect(email.text).toContain("Glow Studio");
  });

  it("sanitizes subject line breaks and rejects unsafe links", () => {
    const email = bookingConfirmationEmail({
      ...appointment,
      service: "Haircut\nBcc: someone@example.com",
      manageUrl: "javascript:alert(1)",
    });

    expect(email.subject).not.toContain("\n");
    expect(email.subject).toContain("Haircut Bcc: someone@example.com");
    expect(email.html).not.toContain("javascript:");
    expect(email.html).toContain("Get directions");
  });

  it("uses a fallback when the date is invalid", () => {
    const email = bookingConfirmationEmail({ ...appointment, date: "not-a-date" });

    expect(email.html).toContain("Date to be confirmed");
    expect(email.text).toContain("Date to be confirmed");
  });
});

describe("appointmentReminderEmail", () => {
  it("includes the lead-time label in the subject and intro", () => {
    const email = appointmentReminderEmail({
      ...appointment,
      leadTimeLabel: "tomorrow",
      manageUrl: "https://ksbeautycentre.com/manage/KS-1042",
    });

    expect(email.subject).toBe("Reminder: Haircut & Blowout tomorrow at 10:00 AM");
    expect(email.html).toContain("tomorrow at 10:00 AM");
    expect(email.html).toContain("Reschedule or cancel");
    expect(email.text).toContain("tomorrow at 10:00 AM");
  });

  it("falls back to the full date when no lead time is supplied", () => {
    const email = appointmentReminderEmail(appointment);

    expect(email.subject).toContain("on Sat, Nov 7, 2026 at 10:00 AM");
    expect(email.html).toContain("A reminder about your visit");
  });
});

describe("statusUpdateEmail", () => {
  it("renders confirmed status", () => {
    const email = statusUpdateEmail({ ...appointment, status: "CONFIRMED" });

    expect(email.subject).toBe("Booking confirmed — Haircut & Blowout on Sat, Nov 7, 2026");
    expect(email.html).toContain("Your appointment is confirmed");
    expect(email.html).toContain("Confirmed");
    expect(email.html).toContain("#15803d");
    expect(email.text).toContain("good news");
  });

  it("renders pending status", () => {
    const email = statusUpdateEmail({ ...appointment, status: "PENDING" });

    expect(email.subject).toContain("We've received your booking request");
    expect(email.html).toContain("received your request");
    expect(email.html).toContain("Pending");
  });

  it("renders cancelled status with a rebooking call to action", () => {
    const email = statusUpdateEmail({
      ...appointment,
      status: "CANCELLED",
      rebookUrl: "https://ksbeautycentre.com/book",
    });

    expect(email.subject).toContain("Booking cancelled");
    expect(email.html).toContain("Your appointment has been cancelled");
    expect(email.html).toContain("Book a new appointment");
    expect(email.html).toContain("https://ksbeautycentre.com/book");
    expect(email.html).toContain("24 hours");
    expect(email.text).toContain("has been cancelled");
  });

  it("renders completed status with a review call to action", () => {
    const email = statusUpdateEmail({
      ...appointment,
      status: "COMPLETED",
      reviewUrl: "https://ksbeautycentre.com/review",
    });

    expect(email.subject).toBe("Thank you for visiting K & S Beauty Centre");
    expect(email.html).toContain("Thank you for visiting");
    expect(email.html).toContain("Share your feedback");
    expect(email.html).toContain("https://ksbeautycentre.com/review");
    expect(email.html).toContain("Completed");
  });

  it("includes a custom message and escapes it in HTML", () => {
    const email = statusUpdateEmail({
      ...appointment,
      status: "CANCELLED",
      message: "We had to close early <today>.",
    });

    expect(email.html).toContain("We had to close early &lt;today&gt;.");
    expect(email.text).toContain("We had to close early <today>.");
  });
});
