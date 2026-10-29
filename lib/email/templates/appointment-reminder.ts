import type {
  AppointmentReminderData,
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

export function appointmentReminderEmail(
  data: AppointmentReminderData,
  brandOverrides: Partial<EmailBrand> = {}
): EmailTemplate {
  const brand = resolveBrand(brandOverrides);
  const firstName = getFirstName(data.customerName);
  const fullDate = formatAppointmentDate(data.date);
  const shortDate = formatAppointmentDateShort(data.date);
  const directionsUrl = safeHttpUrl(data.directionsUrl, getDirectionsUrl(brand));
  const manageUrl = safeHttpUrl(data.manageUrl, "");
  const leadTime = data.leadTimeLabel?.trim();

  const htmlGreeting =
    firstName === "there" ? "Hello" : `Hi ${escapeHtml(firstName)}`;
  const textGreeting = firstName === "there" ? "Hello" : `Hi ${firstName}`;
  const whenText = leadTime
    ? `${leadTime} at ${data.time}`
    : `on ${fullDate} at ${data.time}`;
  const intro = `${htmlGreeting}, this is a friendly reminder that your ${escapeHtml(data.service)} appointment is ${escapeHtml(whenText)}.`;
  const ctaLabel = manageUrl ? "Reschedule or cancel" : "Get directions";
  const ctaHref = manageUrl || directionsUrl;
  const subjectTiming = leadTime
    ? `${leadTime} at ${data.time}`
    : `on ${shortDate} at ${data.time}`;

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
    title: `Appointment reminder — ${brand.name}`,
    preheader: `Your ${data.service} appointment is ${whenText}.`,
    badgeHtml: renderBadge("Reminder", "#b45309", "#fffbeb", "#fde68a"),
    heading: "A reminder about your visit",
    intro,
    body,
    footerNote: `You received this email because you booked an appointment with ${brand.name}.`,
  });

  const text = [
    brand.name.toUpperCase(),
    brand.tagline,
    "",
    `${textGreeting},`,
    "",
    `This is a friendly reminder that your ${data.service} appointment is ${whenText}.`,
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
    subject: sanitizeSubject(`Reminder: ${data.service} ${subjectTiming}`),
    preheader: `Your ${data.service} appointment is ${whenText}.`,
    html,
    text,
  };
}
