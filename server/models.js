import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "customer"], default: "customer", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    avatarUrl: { type: String },
    createdAt: { type: Date, default: Date.now }
}, { toJSON: { virtuals: true } });

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 900 } // Expires in 15 minutes (900 seconds)
});

const timeSlotSchema = new mongoose.Schema({
    date: { type: String, required: true }, // YYYY-MM-DD
    startTime: { type: String, required: true }, // HH:mm
    endTime: { type: String, required: true }, // HH:mm
    capacity: { type: Number, default: 1, required: true },
    bookedCount: { type: Number, default: 0, required: true }
}, { toJSON: { virtuals: true } });

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    slotId: { type: mongoose.Schema.Types.ObjectId, ref: "TimeSlot", required: true },
    status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending", required: true },
    createdAt: { type: Date, default: Date.now }
}, { toJSON: { virtuals: true } });

const blockedDateSchema = new mongoose.Schema({
    date: { type: String, required: true, unique: true }, // YYYY-MM-DD
    reason: { type: String }
}, { toJSON: { virtuals: true } });

export const User = mongoose.model("User", userSchema);
export const OTP = mongoose.model("OTP", otpSchema);
export const TimeSlot = mongoose.model("TimeSlot", timeSlotSchema);
export const Booking = mongoose.model("Booking", bookingSchema);
export const BlockedDate = mongoose.model("BlockedDate", blockedDateSchema);
