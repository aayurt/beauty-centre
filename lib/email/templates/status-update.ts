import type {
  BookingStatusValue,
  EmailBrand,
  EmailTemplate,
  StatusUpdateData,
} from "../types";
import { resolveBrand } from "../brand";
import {
  formatAppointmentDate,
  formatAppointmentDateShort,
  getBookingUrl,
  getDirectionsUrl,
  getFirstName,
  safeHttpUrl,
  sanitizeSubject,
} from "../format";
import {
  escapeHtml,
  nl2br,
  renderBadge,
  renderButton,
  renderDateTimeCard,
  renderDetailsTable,
  renderEmailLayout,
  renderLocationSection,
  renderPolicySection,
  spacer,
} from "../html";
import {
  renderAppointmentText,
  renderFooterText,
  renderLocationText,
  renderPolicyText,
} from "../text";

interface StatusContent {
  label: string;
  accent: string;
  background: string;
  border: string;
  heading: string;
  subject: (data: StatusUpdateData, brand: EmailBrand, shortDate: string) => string;
  intro: (
    data: StatusUpdateData,
    brand: EmailBrand,
    firstName: string,
    fullDate: string
  ) => string;
  introText: (
    data: StatusUpdateData,
    brand: EmailBrand,
    firstName: string,
    fullDate: string
  ) => string;
  cta: (
    data: StatusUpdateData,
    brand: EmailBrand
  ) => { label: string; href: string };
}

function htmlGreeting(firstName: string): string {
  return firstName === "there" ? "Hello" : `Hi ${escapeHtml(firstName)}`;
}

function textGreeting(firstName: string): string {
  return firstName === "there" ? "Hello" : `Hi ${firstName}`;
}

function rebookHref(data: StatusUpdateData, brand: EmailBrand): string {
  return safeHttpUrl(data.rebookUrl, getBookingUrl(brand));
}

const statusContent: Record<BookingStatusValue, StatusContent> = {
  PENDING: {
    label: "Pending",
    accent: "#b45309",
    background: "#fffbeb",
    border: "#fde68a",
    heading: "We've received your request",
    subject: (data) => `We've received your booking request — ${data.service}`,
    intro: (data, brand, firstName, fullDate) =>
      `${htmlGreeting(firstName)}, we've received your request for ${escapeHtml(data.service)} on ${escapeHtml(fullDate)} at ${escapeHtml(data.time)}. Our team will review availability and confirm your appointment shortly.`,
    introText: (data, brand, firstName, fullDate) =>
      `${textGreeting(firstName)}, we've received your request for ${data.service} on ${fullDate} at ${data.time}. Our team will review availability and confirm your appointment shortly.`,
    cta: (data, brand) => ({
      label: safeHttpUrl(data.manageUrl, "") ? "View your request" : "Get directions",
      href: safeHttpUrl(data.manageUrl, getDirectionsUrl(brand)),
    }),
  },
  CONFIRMED: {
    label: "Confirmed",
    accent: "#15803d",
    background: "#f0fdf4",
    border: "#bbf7d0",
    heading: "Your appointment is confirmed",
    subject: (data, brand, shortDate) =>
      `Booking confirmed — ${data.service} on ${shortDate}`,
    intro: (data, brand, firstName) =>
      `${htmlGreeting(firstName)}, good news — your ${escapeHtml(data.service)} appointment is confirmed. We look forward to welcoming you.`,
    introText: (data, brand, firstName) =>
      `${textGreeting(firstName)}, good news — your ${data.service} appointment is confirmed. We look forward to welcoming you.`,
    cta: (data, brand) => ({
      label: safeHttpUrl(data.manageUrl, "") ? "Manage your booking" : "Get directions",
      href: safeHttpUrl(data.manageUrl, getDirectionsUrl(brand)),
    }),
  },
  CANCELLED: {
    label: "Cancelled",
    accent: "#be123c",
    background: "#fff1f2",
    border: "#fecdd3",
    heading: "Your appointment has been cancelled",
    subject: (data, brand, shortDate) =>
      `Booking cancelled — ${data.service} on ${shortDate}`,
    intro: (data, brand, firstName, fullDate) =>
      `${htmlGreeting(firstName)}, your ${escapeHtml(data.service)} appointment on ${escapeHtml(fullDate)} at ${escapeHtml(data.time)} has been cancelled. If this wasn't expected, please contact us as soon as possible.`,
    introText: (data, brand, firstName, fullDate) =>
      `${textGreeting(firstName)}, your ${data.service} appointment on ${fullDate} at ${data.time} has been cancelled. If this wasn't expected, please contact us as soon as possible.`,
    cta: (data, brand) => ({
      label: "Book a new appointment",
      href: rebookHref(data, brand),
    }),
  },
  COMPLETED: {
    label: "Completed",
    accent: "#b45309",
    background: "#fffbeb",
    border: "#fde68a",
    heading: "Thank you for visiting",
    subject: (data, brand) => `Thank you for visiting ${brand.name}`,
    intro: (data, brand, firstName) =>
      `${htmlGreeting(firstName)}, thank you for visiting us for ${escapeHtml(data.service)}. We hope you love the result and would love to hear about your experience.`,
    introText: (data, brand, firstName) =>
      `${textGreeting(firstName)}, thank you for visiting us for ${data.service}. We hope you love the result and would love to hear about your experience.`,
    cta: (data, brand) => ({
      label: safeHttpUrl(data.reviewUrl, "")
        ? "Share your feedback"
        : "Book your next visit",
      href: safeHttpUrl(data.reviewUrl, rebookHref(data, brand)),
    }),
  },
};

export function statusUpdateEmail(
  data: StatusUpdateData,
  brandOverrides: Partial<EmailBrand> = {}
): EmailTemplate {
  const brand = resolveBrand(brandOverrides);
  const firstName = getFirstName(data.customerName);
  const fullDate = formatAppointmentDate(data.date);
  const shortDate = formatAppointmentDateShort(data.date);
  const directionsUrl = safeHttpUrl(data.directionsUrl, getDirectionsUrl(brand));
  const content = statusContent[data.status] ?? statusContent.PENDING;
  const cta = content.cta(data, brand);
  const customMessage = data.message?.trim();

  const messageBlock = customMessage
    ? `${spacer(18)}<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#faf9f7" style="width:100%;background-color:#faf9f7;border:1px solid #e8e5e0;border-radius:12px;"><tr><td style="padding:16px 20px;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:13px;line-height:21px;color:#56524b;">${nl2br(customMessage)}</td></tr></table>`
    : "";

  const body = [
    renderDateTimeCard(data, fullDate),
    messageBlock,
    spacer(20),
    renderDetailsTable(data),
    spacer(20),
    renderLocationSection(brand, directionsUrl),
    spacer(20),
    renderPolicySection(brand),
    spacer(24),
    renderButton(cta.label, cta.href),
  ].join("");

  const preheader =
    data.status === "CANCELLED"
      ? `Your ${data.service} appointment on ${fullDate} at ${data.time} has been cancelled.`
      : data.status === "COMPLETED"
        ? `Thank you for visiting us for ${data.service}. We'd love to hear about your experience.`
        : data.status === "PENDING"
          ? `We've received your request for ${data.service} on ${fullDate} at ${data.time}.`
          : `Your ${data.service} appointment is confirmed for ${fullDate} at ${data.time}.`;

  const html = renderEmailLayout({
    brand,
    title: `${content.label} — ${brand.name}`,
    preheader,
    badgeHtml: renderBadge(
      content.label,
      content.accent,
      content.background,
      content.border
    ),
    heading: content.heading,
    intro: content.intro(data, brand, firstName, fullDate),
    body,
    accentColor: content.accent,
    footerNote: `You received this email because you booked an appointment with ${brand.name}.`,
  });

  const text = [
    brand.name.toUpperCase(),
    brand.tagline,
    "",
    content.introText(data, brand, firstName, fullDate),
    ...(customMessage ? ["", customMessage] : []),
    "",
    renderAppointmentText(data),
    "",
    renderLocationText(brand, directionsUrl),
    "",
    renderPolicyText(brand),
    "",
    `${cta.label}: ${cta.href}`,
    "",
    renderFooterText(brand),
  ].join("\n");

  return {
    subject: sanitizeSubject(content.subject(data, brand, shortDate)),
    preheader,
    html,
    text,
  };
}
