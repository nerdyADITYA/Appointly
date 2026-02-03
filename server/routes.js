import { setupAuth, crypto } from "./auth.js";
import { storage } from "./storage.js";
import { api } from "../shared/routes.js";
import { z } from "zod";
import { addDays, format, setHours, setMinutes } from "date-fns";
import { OTP, User } from "./models.js";
import { sendOtp } from "./email.js";
import multer from "multer";
import express from "express";
import path from "path";

async function seedDatabase() {
  const adminUser = await storage.getUserByUsername("admin");
  if (!adminUser) {
    const hashedPassword = await crypto.hash("admin123");
    await storage.createUser({
      username: "admin",
      password: hashedPassword,
      role: "admin",
      name: "Business Owner"
    });
    console.log("Seeded admin user");
  }

  const customerUser = await storage.getUserByUsername("customer");
  if (!customerUser) {
    const hashedPassword = await crypto.hash("customer123");
    await storage.createUser({
      username: "customer",
      password: hashedPassword,
      role: "customer",
      name: "John Doe"
    });
    console.log("Seeded customer user");
  }

  const existingSlots = await storage.getSlots();
  if (existingSlots.length === 0) {
    const today = new Date();
    for (let i = 0; i < 5; i++) {
      const date = format(addDays(today, i), "yyyy-MM-dd");
      for (let hour = 9; hour < 17; hour++) {
        const startTime = format(setMinutes(setHours(today, hour), 0), "HH:mm");
        const endTime = format(setMinutes(setHours(today, hour + 1), 0), "HH:mm");
        if (hour !== 12) {
          await storage.createSlot({
            date,
            startTime,
            endTime,
            capacity: 3
            // 3 bookings per slot
          });
        }
      }
    }
    console.log("Seeded time slots");
  }
}

async function registerRoutes(httpServer, app) {
  setupAuth(app);
  seedDatabase().catch(console.error);

  // Serve uploads directory
  app.use("/uploads", express.static("uploads"));

  // Multer setup
  const storageConfig = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });
  const upload = multer({ storage: storageConfig });

  app.post("/api/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    // Return the URL to access the file
    res.json({ url: `/uploads/${req.file.filename}` });
  });

  app.post("/api/send-otp", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ message: "Email is required" });

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Save to DB
      await OTP.create({ email, otp });

      // Send Email
      await sendOtp(email, otp);

      res.status(200).json({ message: "OTP sent successfully" });
    } catch (err) {
      console.error("Send OTP Error:", err);
      res.status(500).json({ message: "Failed to send OTP", details: err.message });
    }
  });

  app.get(api.slots.list.path, async (req, res) => {
    try {
      const date = typeof req.query.date === "string" ? req.query.date : void 0;
      const slots = await storage.getSlots({ date });
      res.json(slots);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch slots" });
    }
  });

  app.post(api.slots.create.path, async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    try {
      const input = api.slots.create.input.parse(req.body);
      const isBlocked = await storage.isDateBlocked(input.date);
      if (isBlocked) {
        return res.status(400).json({ message: "This date is blocked" });
      }
      const slot = await storage.createSlot(input);
      res.status(201).json(slot);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Failed to create slot" });
    }
  });

  app.delete(api.slots.delete.path, async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    const id = req.params.id; // ID is string in Mongoose
    const slot = await storage.getSlot(id);
    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }
    if (slot.bookedCount > 0) {
      return res.status(400).json({ message: "Cannot delete slot with existing bookings" });
    }
    await storage.deleteSlot(id);
    res.status(204).send();
  });

  app.get(api.bookings.list.path, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Login required" });
    }
    const userId = req.user.role === "admin" ? void 0 : req.user.id;
    const bookings = await storage.getBookings({ userId });
    res.json(bookings);
  });

  app.patch("/api/user", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Login required" });
    }
    try {
      // Validate using the partial schema
      const updates = api.users.update.input.parse(req.body);

      // Handle Password Hashing
      if (updates.password) {
        updates.password = await crypto.hash(updates.password);
      }

      // Handle Email Uniqueness
      if (updates.email && updates.email !== req.user.email) {
        const existingEmail = await User.findOne({ email: updates.email });
        if (existingEmail) {
          return res.status(400).json({ message: "Email already registered" });
        }
      }

      const updatedUser = await storage.updateUser(req.user.id, updates);
      res.json(updatedUser);
    } catch (err) {
      console.error("Profile Update Error:", err); // Log full error
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Failed to update profile", details: err.message });
    }
  });

  app.post(api.bookings.create.path, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Login required" });
    }
    try {
      const { slotId } = api.bookings.create.input.parse(req.body);
      const slot = await storage.getSlot(slotId);
      if (!slot) {
        return res.status(404).json({ message: "Slot not found" });
      }
      if (slot.bookedCount >= slot.capacity) {
        return res.status(400).json({ message: "Slot is fully booked" });
      }
      const existingBookings = await storage.getBookings({ userId: req.user.id });
      // slotId and slot.id are objects or strings, better compare strings
      const hasBooking = existingBookings.some((b) => String(b.slotId) === String(slotId) && b.status === "confirmed");
      if (hasBooking) {
        return res.status(400).json({ message: "You already booked this slot" });
      }
      const booking = await storage.createBooking({
        userId: req.user.id,
        slotId,
        status: "confirmed"
      });
      await storage.updateSlotBookingCount(slotId, 1);
      res.status(201).json(booking);
    } catch (err) {
      console.error("Booking Create Error:", err.message);
      if (err.stack) console.error(err.stack);
      res.status(500).json({ message: "Booking failed", details: err.message });
    }
  });

  app.patch(api.bookings.cancel.path, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Login required" });
    }
    const id = req.params.id;
    const booking = await storage.getBooking(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    // Compare ObjectIds as strings
    if (String(booking.userId) !== String(req.user.id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking already cancelled" });
    }
    const updated = await storage.cancelBooking(id);
    await storage.updateSlotBookingCount(booking.slotId, -1);
    res.json(updated);
  });

  app.get(api.blockedDates.list.path, async (req, res) => {
    const dates = await storage.getBlockedDates();
    res.json(dates);
  });

  app.post(api.blockedDates.create.path, async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    try {
      const input = api.blockedDates.create.input.parse(req.body);
      const blocked = await storage.createBlockedDate(input);
      res.status(201).json(blocked);
    } catch (err) {
      res.status(500).json({ message: "Failed to block date" });
    }
  });

  app.delete(api.blockedDates.delete.path, async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    const id = req.params.id;
    await storage.deleteBlockedDate(id);
    res.status(204).send();
  });

  return httpServer;
}

export {
  registerRoutes
};

