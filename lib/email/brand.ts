import type { EmailBrand } from "./types";

const fallbackSiteUrl = "https://ksbeautycentre.com";

const configuredSiteUrl =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL
    : fallbackSiteUrl;

export const defaultBrand: EmailBrand = {
  name: "K & S Beauty Centre",
  tagline: "Crafting Beauty, One Client at a Time",
  address: "Chitra Marg, 1804, Ward 1\nJamal, Kathmandu 44600, Nepal",
  phone: "+977 1 536 6095",
  email: "hello@ksbeautycentre.com",
  hours:
    "Monday - Friday: 9:00 AM - 8:00 PM\nSaturday: 9:00 AM - 6:00 PM\nSunday: 10:00 AM - 4:00 PM",
  siteUrl: configuredSiteUrl.replace(/\/+$/, ""),
  cancellationPolicy: [
    "Please give us at least 24 hours' notice to reschedule or cancel your appointment.",
    "Late cancellations and no-shows may be subject to a fee.",
    "Arrive 10 minutes early so your treatment can start on time.",
  ],
};

export interface CompanyProfileSource {
  name?: string | null;
  tagline?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  hours?: string | null;
  logo?: string | null;
  siteUrl?: string | null;
}

function absoluteUrl(value: string, siteUrl: string): string {
  if (/^https?:\/\//i.test(value)) return value;
  return `${siteUrl}/${value.replace(/^\/+/, "")}`;
}

export function resolveBrand(overrides: Partial<EmailBrand> = {}): EmailBrand {
  const siteUrl = (overrides.siteUrl ?? defaultBrand.siteUrl).replace(/\/+$/, "");
  const logoUrl = overrides.logoUrl
    ? absoluteUrl(overrides.logoUrl, siteUrl)
    : undefined;

  return {
    ...defaultBrand,
    ...overrides,
    siteUrl,
    logoUrl,
    cancellationPolicy:
      overrides.cancellationPolicy ?? defaultBrand.cancellationPolicy,
  };
}

export function createEmailBrand(
  profile?: CompanyProfileSource | null,
  overrides: Partial<EmailBrand> = {}
): EmailBrand {
  const siteUrl = (overrides.siteUrl ?? defaultBrand.siteUrl).replace(/\/+$/, "");
  const fromProfile: Partial<EmailBrand> = {};

  if (profile) {
    if (profile.name?.trim()) fromProfile.name = profile.name.trim();
    if (profile.tagline?.trim()) fromProfile.tagline = profile.tagline.trim();
    if (profile.address?.trim()) fromProfile.address = profile.address.trim();
    if (profile.phone?.trim()) fromProfile.phone = profile.phone.trim();
    if (profile.email?.trim()) fromProfile.email = profile.email.trim();
    if (profile.hours?.trim()) fromProfile.hours = profile.hours.trim();
    if (profile.logo?.trim()) fromProfile.logoUrl = profile.logo.trim();
  }

  return resolveBrand({ siteUrl, ...fromProfile, ...overrides });
}
