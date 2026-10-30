export type {
  AppointmentData,
  AppointmentReminderData,
  BookingConfirmationData,
  BookingStatusValue,
  EmailBrand,
  EmailTemplate,
  StatusUpdateData,
} from "./types";

export {
  createEmailBrand,
  defaultBrand,
  resolveBrand,
  type CompanyProfileSource,
} from "./brand";

export {
  formatAddress,
  formatAppointmentDate,
  formatAppointmentDateShort,
  getBookingUrl,
  getDirectionsUrl,
  getFirstName,
  parseAppointmentDate,
} from "./format";

export { bookingConfirmationEmail } from "./templates/booking-confirmation";
export { appointmentReminderEmail } from "./templates/appointment-reminder";
export { statusUpdateEmail } from "./templates/status-update";
export { getResendClient, getDefaultFromEmail } from "./client";
