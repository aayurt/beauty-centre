import type { AppointmentData, EmailBrand } from "./types";
import { formatAddress, formatAppointmentDate } from "./format";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function nl2br(value: string): string {
  return escapeHtml(value).replace(/\r?\n/g, "<br />");
}

export function renderAppointmentText(data: AppointmentData): string {
  const lines = [
    "APPOINTMENT DETAILS",
    `Service: ${data.service}`,
    `Date: ${formatAppointmentDate(data.date)}`,
    `Time: ${data.time}`,
  ];

  if (data.stylist) lines.push(`Stylist: ${data.stylist}`);
  if (data.duration) lines.push(`Duration: ${data.duration}`);
  if (data.price) lines.push(`Price: ${data.price}`);
  if (data.bookingReference) lines.push(`Booking ref: ${data.bookingReference}`);
  if (data.notes?.trim()) lines.push(`Notes: ${data.notes.trim()}`);

  return lines.join("\n");
}

export function renderLocationText(
  brand: EmailBrand,
  directionsUrl: string
): string {
  return [
    "WHERE TO FIND US",
    brand.address,
    `Phone: ${brand.phone}`,
    `Email: ${brand.email}`,
    `Directions: ${directionsUrl}`,
  ].join("\n");
}

export function renderPolicyText(brand: EmailBrand): string {
  const items = brand.cancellationPolicy
    .filter((item) => item.trim())
    .map((item) => `- ${item}`)
    .join("\n");

  return [
    "CANCELLATION GUIDELINES",
    items,
    `To change your booking, call ${brand.phone} or reply to this email.`,
  ].join("\n");
}

export function renderBrandText(brand: EmailBrand): string {
  return [brand.name.toUpperCase(), brand.tagline].join("\n");
}

export function renderFooterText(brand: EmailBrand): string {
  return [
    brand.name,
    formatAddress(brand.address),
    `${brand.phone} | ${brand.email}`,
    brand.hours,
    `© ${new Date().getFullYear()} ${brand.name}. You received this email because you booked an appointment with us.`,
  ].join("\n");
}
