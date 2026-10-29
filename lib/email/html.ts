import type { AppointmentData, EmailBrand } from "./types";
import { escapeHtml, nl2br } from "./text";

export { escapeHtml, nl2br } from "./text";

export const FONT_SANS =
  "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";
export const FONT_SERIF =
  "'Playfair Display', Georgia, 'Times New Roman', serif";

const palette = {
  amber: "#f59e0b",
  amberDark: "#b45309",
  amberSoft: "#fffbeb",
  amberBorder: "#fde68a",
  rose: "#fb7185",
  roseSoft: "#fff1f2",
  roseBorder: "#ffe4e6",
  ink: "#1c1a17",
  text: "#2d2d2d",
  muted: "#78736b",
  quiet: "#a8a39b",
  cream: "#f5f3f0",
  card: "#ffffff",
  border: "#e8e5e0",
  soft: "#faf9f7",
};

function escapeAttribute(value: string): string {
  return escapeHtml(value);
}

function spacer(height = 18): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="${height}" style="height:${height}px;line-height:${height}px;font-size:1px;">&nbsp;</td></tr></table>`;
}

function sectionLabel(label: string): string {
  return `<div style="margin:0 0 10px;font-family:${FONT_SANS};font-size:11px;line-height:16px;letter-spacing:0.14em;text-transform:uppercase;color:${palette.muted};font-weight:700;">${escapeHtml(label)}</div>`;
}

function brandMark(brand: EmailBrand): string {
  if (brand.logoUrl) {
    return `<img src="${escapeAttribute(brand.logoUrl)}" width="168" alt="${escapeAttribute(brand.name)}" style="display:block;width:168px;max-width:70%;height:auto;margin:0 auto 12px;border:0;outline:none;text-decoration:none;" />`;
  }

  const match = brand.name.match(/^(K\s*&\s*S)\s+(.+)$/i);
  const primary = match ? match[1] : brand.name;
  const secondary = match ? match[2] : "Beauty Centre";

  return `<div style="font-family:${FONT_SERIF};font-size:31px;line-height:1.1;letter-spacing:0.12em;color:${palette.ink};">${escapeHtml(primary)}</div>
  <div style="margin-top:6px;font-family:${FONT_SANS};font-size:10px;line-height:1.2;letter-spacing:0.3em;text-transform:uppercase;color:${palette.amberDark};font-weight:700;">${escapeHtml(secondary)}</div>`;
}

export function renderButton(label: string, href: string): string {
  return `<table role="presentation" class="email-button" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;">
  <tr>
    <td align="center" bgcolor="${palette.amber}" style="border-radius:999px;">
      <a href="${escapeAttribute(href)}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:14px 30px;font-family:${FONT_SANS};font-size:14px;line-height:1;font-weight:700;letter-spacing:0.02em;text-decoration:none;color:#ffffff;border-radius:999px;">${escapeHtml(label)}</a>
    </td>
  </tr>
</table>`;
}

export function renderBadge(label: string, accent: string, background: string, border: string): string {
  return `<div style="margin:0 0 14px;"><span style="display:inline-block;padding:7px 14px;border-radius:999px;background-color:${background};border:1px solid ${border};font-family:${FONT_SANS};font-size:11px;line-height:1;letter-spacing:0.12em;text-transform:uppercase;color:${accent};font-weight:700;">${escapeHtml(label)}</span></div>`;
}

export function renderDateTimeCard(data: AppointmentData, fullDate: string): string {
  const timing = data.duration
    ? `${escapeHtml(data.time)} &nbsp;&middot;&nbsp; ${escapeHtml(data.duration)}`
    : escapeHtml(data.time);

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${palette.roseSoft}" style="width:100%;background-color:${palette.roseSoft};border:1px solid ${palette.roseBorder};border-radius:14px;">
  <tr>
    <td align="center" style="padding:22px 18px;">
      <div style="margin:0 0 8px;font-family:${FONT_SANS};font-size:10px;line-height:14px;letter-spacing:0.18em;text-transform:uppercase;color:${palette.amberDark};font-weight:700;">Your appointment</div>
      <div class="email-date" style="margin:0 0 6px;font-family:${FONT_SERIF};font-size:20px;line-height:28px;color:${palette.text};">${escapeHtml(fullDate)}</div>
      <div style="margin:0;font-family:${FONT_SANS};font-size:15px;line-height:22px;color:${palette.rose};font-weight:700;">${timing}</div>
    </td>
  </tr>
</table>`;
}

export function renderDetailsTable(data: AppointmentData): string {
  const rows: Array<{ label: string; value: string }> = [
    { label: "Service", value: escapeHtml(data.service) },
  ];

  if (data.stylist) rows.push({ label: "Stylist", value: escapeHtml(data.stylist) });
  if (data.duration) rows.push({ label: "Duration", value: escapeHtml(data.duration) });
  if (data.price) rows.push({ label: "Price", value: escapeHtml(data.price) });
  if (data.bookingReference) {
    rows.push({
      label: "Booking ref",
      value: escapeHtml(String(data.bookingReference)),
    });
  }
  if (data.notes?.trim()) {
    rows.push({ label: "Your notes", value: nl2br(data.notes.trim()) });
  }

  const rowHtml = rows
    .map((row, index) => {
      const divider =
        index < rows.length - 1
          ? `<tr><td colspan="2" style="border-top:1px solid ${palette.border};font-size:1px;line-height:1px;">&nbsp;</td></tr>`
          : "";

      return `<tr>
        <td class="email-detail-label" width="42%" valign="top" style="padding:12px 12px 12px 0;font-family:${FONT_SANS};font-size:11px;line-height:18px;letter-spacing:0.08em;text-transform:uppercase;color:${palette.muted};font-weight:700;">${escapeHtml(row.label)}</td>
        <td class="email-detail-value" valign="top" style="padding:12px 0;font-family:${FONT_SANS};font-size:14px;line-height:21px;color:${palette.text};font-weight:600;text-align:right;">${row.value}</td>
      </tr>${divider}`;
    })
    .join("");

  return `${sectionLabel("Appointment details")}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${palette.soft}" style="width:100%;background-color:${palette.soft};border:1px solid ${palette.border};border-radius:12px;">
    <tr><td style="padding:2px 20px;">${rows.length ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rowHtml}</table>` : ""}</td></tr>
  </table>`;
}

export function renderLocationSection(
  brand: EmailBrand,
  directionsUrl: string
): string {
  return `${sectionLabel("Location")}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${palette.soft}" style="width:100%;background-color:${palette.soft};border:1px solid ${palette.border};border-radius:12px;">
    <tr>
      <td style="padding:18px 20px;">
        <div style="font-family:${FONT_SANS};font-size:14px;line-height:22px;color:${palette.text};font-weight:600;">${nl2br(brand.address)}</div>
        <div style="margin-top:8px;font-family:${FONT_SANS};font-size:13px;line-height:20px;color:${palette.muted};">
          <a href="tel:${escapeAttribute(brand.phone.replace(/[^\d+]/g, ""))}" style="color:${palette.amberDark};text-decoration:none;font-weight:600;">${escapeHtml(brand.phone)}</a>
          &nbsp;&middot;&nbsp;
          <a href="mailto:${escapeAttribute(brand.email)}" style="color:${palette.muted};text-decoration:underline;">${escapeHtml(brand.email)}</a>
        </div>
        <div style="margin-top:14px;">
          <a href="${escapeAttribute(directionsUrl)}" target="_blank" rel="noopener noreferrer" style="font-family:${FONT_SANS};font-size:13px;line-height:20px;font-weight:700;color:${palette.amberDark};text-decoration:none;">Get directions &rarr;</a>
        </div>
      </td>
    </tr>
  </table>`;
}

export function renderPolicySection(brand: EmailBrand): string {
  const items = brand.cancellationPolicy
    .filter((item) => item.trim())
    .map(
      (item) =>
        `<li style="margin:0 0 7px;font-family:${FONT_SANS};font-size:12px;line-height:19px;color:${palette.text};">${escapeHtml(item)}</li>`
    )
    .join("");

  return `${sectionLabel("Cancellation guidelines")}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${palette.amberSoft}" style="width:100%;background-color:${palette.amberSoft};border:1px solid ${palette.amberBorder};border-radius:12px;">
    <tr>
      <td style="padding:16px 20px;">
        <ul style="margin:0;padding:0 0 0 18px;">${items}</ul>
        <div style="margin-top:10px;font-family:${FONT_SANS};font-size:12px;line-height:19px;color:${palette.muted};">
          To change your booking, call <a href="tel:${escapeAttribute(brand.phone.replace(/[^\d+]/g, ""))}" style="color:${palette.amberDark};text-decoration:none;font-weight:600;">${escapeHtml(brand.phone)}</a> or reply to this email.
        </div>
      </td>
    </tr>
  </table>`;
}

export interface LayoutOptions {
  brand: EmailBrand;
  title: string;
  preheader: string;
  heading: string;
  intro: string;
  body: string;
  badgeHtml?: string;
  footerNote?: string;
  accentColor?: string;
}

export function renderEmailLayout(options: LayoutOptions): string {
  const {
    brand,
    title,
    preheader,
    heading,
    intro,
    body,
    badgeHtml = "",
    footerNote,
    accentColor = palette.amber,
  } = options;

  const year = new Date().getFullYear();
  const addressHtml = nl2br(brand.address);
  const hoursHtml = nl2br(brand.hours);
  const reason =
    footerNote ??
    `You received this email because you booked an appointment with ${brand.name}.`;

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>${escapeHtml(title)}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    @media only screen and (max-width: 620px) {
      .email-container { width: 100% !important; max-width: 100% !important; border-radius: 0 !important; }
      .email-px { padding-left: 20px !important; padding-right: 20px !important; }
      .email-header { padding: 26px 20px 22px !important; }
      .email-h1 { font-size: 24px !important; line-height: 32px !important; }
      .email-date { font-size: 18px !important; line-height: 26px !important; }
      .email-detail-label { display: block !important; width: 100% !important; padding: 10px 0 0 !important; text-align: left !important; }
      .email-detail-value { display: block !important; width: 100% !important; padding: 2px 0 10px !important; text-align: left !important; }
      .email-button { width: 100% !important; }
      .email-button a { display: block !important; width: 100% !important; box-sizing: border-box !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;width:100%;background-color:${palette.cream};font-family:${FONT_SANS};">
  <div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${escapeHtml(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${palette.cream}" style="width:100%;background-color:${palette.cream};">
    <tr>
      <td align="center" style="padding:28px 12px;">
        <table role="presentation" class="email-container" width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="${palette.card}" style="width:600px;max-width:600px;background-color:${palette.card};border:1px solid ${palette.border};border-radius:18px;overflow:hidden;">
          <tr><td height="5" bgcolor="${accentColor}" style="height:5px;line-height:5px;font-size:1px;">&nbsp;</td></tr>
          <tr>
            <td class="email-header" align="center" style="padding:30px 32px 24px;">
              ${brandMark(brand)}
              <div style="margin-top:12px;font-family:${FONT_SERIF};font-style:italic;font-size:13px;line-height:20px;color:${palette.muted};">${escapeHtml(brand.tagline)}</div>
            </td>
          </tr>
          <tr>
            <td class="email-px" style="padding:4px 32px 0;">
              ${badgeHtml}
              <h1 class="email-h1" style="margin:0 0 14px;font-family:${FONT_SERIF};font-size:28px;line-height:36px;font-weight:400;color:${palette.ink};">${escapeHtml(heading)}</h1>
              <p style="margin:0 0 24px;font-family:${FONT_SANS};font-size:15px;line-height:24px;color:#56524b;">${intro}</p>
            </td>
          </tr>
          <tr>
            <td class="email-px" style="padding:0 32px 32px;">
              ${body}
            </td>
          </tr>
          <tr>
            <td class="email-px" style="padding:0 32px;"><div style="border-top:1px solid ${palette.border};font-size:1px;line-height:1px;">&nbsp;</div></td>
          </tr>
          <tr>
            <td class="email-px" style="padding:24px 32px 30px;">
              <div style="font-family:${FONT_SERIF};font-size:16px;line-height:22px;color:${palette.text};">${escapeHtml(brand.name)}</div>
              <div style="margin-top:8px;font-family:${FONT_SANS};font-size:12px;line-height:19px;color:${palette.muted};">${addressHtml}</div>
              <div style="margin-top:5px;font-family:${FONT_SANS};font-size:12px;line-height:19px;color:${palette.muted};">
                <a href="tel:${escapeAttribute(brand.phone.replace(/[^\d+]/g, ""))}" style="color:${palette.muted};text-decoration:none;">${escapeHtml(brand.phone)}</a>
                &nbsp;&middot;&nbsp;
                <a href="mailto:${escapeAttribute(brand.email)}" style="color:${palette.muted};text-decoration:none;">${escapeHtml(brand.email)}</a>
              </div>
              <div style="margin-top:5px;font-family:${FONT_SANS};font-size:11px;line-height:17px;color:${palette.quiet};">${hoursHtml}</div>
              <div style="margin-top:16px;font-family:${FONT_SANS};font-size:10px;line-height:16px;color:${palette.quiet};">&copy; ${year} ${escapeHtml(brand.name)}. ${escapeHtml(reason)}</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export { spacer };
