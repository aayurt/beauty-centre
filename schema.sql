-- K & S Beauty Centre - Database Schema
-- Run this SQL in your Neon console to create the contacts table

CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries by email
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);

-- Create index for created_at for sorting
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at);

-- Booking Inquiries table
CREATE TABLE IF NOT EXISTS booking_inquiries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  service VARCHAR(255) NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for created_at for sorting
CREATE INDEX IF NOT EXISTS idx_booking_inquiries_created_at ON booking_inquiries(created_at);