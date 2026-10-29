export type BookingStatusValue =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED";

export interface EmailBrand {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  siteUrl: string;
  logoUrl?: string;
  cancellationPolicy: string[];
}

export interface AppointmentData {
  customerName: string;
  customerEmail?: string;
  service: string;
  date: Date | string;
  time: string;
  duration?: string;
  price?: string;
  stylist?: string;
  bookingReference?: string | number;
  notes?: string;
}

export interface BookingConfirmationData extends AppointmentData {
  manageUrl?: string;
  directionsUrl?: string;
}

export interface AppointmentReminderData extends AppointmentData {
  leadTimeLabel?: string;
  manageUrl?: string;
  directionsUrl?: string;
}

export interface StatusUpdateData extends AppointmentData {
  status: BookingStatusValue;
  message?: string;
  manageUrl?: string;
  directionsUrl?: string;
  reviewUrl?: string;
  rebookUrl?: string;
}

export interface EmailTemplate {
  subject: string;
  preheader: string;
  html: string;
  text: string;
}
