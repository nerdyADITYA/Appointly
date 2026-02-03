import { z } from "zod";

export const insertUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  role: z.enum(["admin", "customer"]).default("customer"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Invalid phone number").optional(), // Phone number
  avatarUrl: z.string().url("Invalid URL").optional(),
  otp: z.string().length(6, "OTP must be 6 digits").optional() // Optional in schema but checked in route logic
});

export const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  phone: z.string().min(10, "Invalid phone number").or(z.literal("")).optional(),
  avatarUrl: z.string().optional(),
  email: z.string().email("Invalid email address").or(z.literal("")).optional(),
  password: z.string().min(6, "Password must be at least 6 characters").or(z.literal("")).optional()
});

export const insertTimeSlotSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"), // YYYY-MM-DD
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"), // HH:mm
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"), // HH:mm
  capacity: z.number().int().min(1).default(1)
});

export const insertBookingSchema = z.object({
  userId: z.string().or(z.number()), // Accommodate string IDs from different sources if needed, Mongoose uses defaults which are Objects mostly handled as strings in JSON
  slotId: z.string().or(z.number()),
});

export const insertBlockedDateSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  reason: z.string().optional()
});

// Export mock table objects if frontend uses them for types or references (though less likely with JS)
// But to keep imports working if any file imports 'users' etc.
export const users = {};
export const timeSlots = {};
export const bookings = {};
export const blockedDates = {};

