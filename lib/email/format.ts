import type { EmailBrand } from "./types";

const TIME_ZONE = "Asia/Kathmandu";

export function parseAppointmentDate(value: Date | string): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const trimmed = value.trim();
  if (!trimmed) return null;

  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(trimmed);
  const parsed = new Date(dateOnly ? `${trimmed}T12:00:00Z` : trimmed);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatAppointmentDate(value: Date | string): string {
  const date = parseAppointmentDate(value);
  if (!date) return "Date to be confirmed";

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: TIME_ZONE,
  }).format(date);
}

export function formatAppointmentDateShort(value: Date | string): string {
  const date = parseAppointmentDate(value);
  if (!date) return "your selected date";

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: TIME_ZONE,
  }).format(date);
}

export function getFirstName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "there";
  return trimmed.split(/\s+/)[0];
}

export function formatAddress(address: string): string {
  return address
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .join(", ");
}

export function getDirectionsUrl(brand: EmailBrand): string {
  const query = encodeURIComponent(formatAddress(brand.address));
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export function getBookingUrl(brand: EmailBrand): string {
  return `${brand.siteUrl.replace(/\/+$/, "")}/#contact`;
}

export function sanitizeSubject(value: string): string {
  return value.replace(/[\r\n]+/g, " ").replace(/\s{2,}/g, " ").trim();
}

export function safeHttpUrl(
  value: string | undefined | null,
  fallback: string
): string {
  const trimmed = value?.trim();
  if (!trimmed || !/^https?:\/\//i.test(trimmed)) return fallback;
  return trimmed;
}
