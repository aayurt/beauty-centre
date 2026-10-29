import type {
  BookingConfirmationData,
  EmailBrand,
  EmailTemplate,
} from "../types";
import { resolveBrand } from "../brand";
import {
  formatAppointmentDate,
  formatAppointmentDateShort,
  getDirectionsUrl,
  getFirstName,
  safeHttpUrl,
  sanitizeSubject,
} from "../format";
import {
  escapeHtml,
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

export function bookingConfirmationEmail(
  data: BookingConfirmationData,
  brandOverrides: Partial<EmailBrand> = {}
): EmailTemplate {
  const brand = resolveBrand(brandOverrides);
  const firstName = getFirstName(data.customerName);
  const fullDate = formatAppointmentDate(data.date);
  const shortDate = formatAppointmentDateShort(data.date);
  const directionsUrl = safeHttpUrl(data.directionsUrl, getDirectionsUrl(brand));
  const manageUrl = safeHttpUrl(data.manageUrl, "");

  const htmlGreeting =
    firstName === "there" ? "Hello" : `Hi ${escapeHtml(firstName)}`;
  const textGreeting = firstName === "there" ? "Hello" : `Hi ${firstName}`;
  const heading =
    firstName === "there" ? "You're booked!" : `You're booked, ${firstName}!`;
  const intro = `${htmlGreeting}, thank you for booking with ${escapeHtml(brand.name)}. Your ${escapeHtml(data.service)} appointment is confirmed — we can't wait to welcome you.`;
  const ctaLabel = manageUrl ? "Manage your booking" : "Get directions";
  const ctaHref = manageUrl || directionsUrl;

  const body = [
    renderDateTimeCard(data, fullDate),
    spacer(20),
    renderDetailsTable(data),
    spacer(20),
    renderLocationSection(brand, directionsUrl),
    spacer(20),
    renderPolicySection(brand),
    spacer(24),
    renderButton(ctaLabel, ctaHref),
  ].join("");

  const html = renderEmailLayout({
    brand,
    title: `Booking confirmed — ${brand.name}`,
    preheader: `Your ${data.service} appointment is confirmed for ${fullDate} at ${data.time}.`,
    badgeHtml: renderBadge("Confirmed", "#15803d", "#f0fdf4", "#bbf7d0"),
    heading,
    intro,
    body,
    footerNote: manageUrl
      ? `You received this email because you booked an appointment with ${brand.name}. Manage your booking any time using the link above.`
      : undefined,
  });

  const text = [
    brand.name.toUpperCase(),
    brand.tagline,
    "",
    `${textGreeting},`,
    "",
    `Thank you for booking with ${brand.name}. Your ${data.service} appointment is confirmed.`,
    "",
    renderAppointmentText(data),
    "",
    renderLocationText(brand, directionsUrl),
    "",
    renderPolicyText(brand),
    "",
    `${ctaLabel}: ${ctaHref}`,
    "",
    renderFooterText(brand),
  ].join("\n");

  return {
    subject: sanitizeSubject(
      `Booking confirmed — ${data.service} on ${shortDate}`
    ),
    preheader: `Your ${data.service} appointment is confirmed for ${fullDate} at ${data.time}.`,
    html,
    text,
  };
}
