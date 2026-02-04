import { User, TimeSlot, Booking, BlockedDate } from "./models.js";

class DatabaseStorage {
  // Users
  async getUser(id) {
    return await User.findById(id);
  }

  async getUserByUsername(username) {
    return await User.findOne({ username });
  }

  async createUser(insertUser) {
    const user = new User(insertUser);
    return await user.save();
  }

  async updateUser(id, updates) {
    return await User.findByIdAndUpdate(id, updates, { new: true });
  }

  // Time Slots
  async getSlots(filters) {
    const query = {};
    if (filters?.date) {
      query.date = filters.date;
    } else if (filters?.startDate && filters?.endDate) {
      query.date = { $gte: filters.startDate, $lte: filters.endDate };
    }
    return await TimeSlot.find(query).sort({ date: 1, startTime: 1 });
  }

  async getSlot(id) {
    return await TimeSlot.findById(id);
  }

  async createSlot(slot) {
    const newSlot = new TimeSlot(slot);
    return await newSlot.save();
  }

  async deleteSlot(id) {
    await TimeSlot.findByIdAndDelete(id);
  }

  async updateSlotBookingCount(id, increment) {
    // increment can be 1 or -1
    await TimeSlot.findByIdAndUpdate(id, { $inc: { bookedCount: increment } });
  }

  // Bookings
  async getBookings(filters) {
    const query = {};
    if (filters?.userId) {
      query.userId = filters.userId;
    }

    const results = await Booking.find(query)
      .populate('userId')
      .populate('slotId')
      .sort({ createdAt: -1 });

    // Transform to match expected format: { ...booking, user, slot }
    return results.map(doc => {
      const obj = doc.toObject();
      return {
        ...obj,
        user: obj.userId, // After populate, this is the user object
        slot: obj.slotId, // After populate, this is the slot object
        // userId and slotId fields in the returned object will be objects, 
        // but frontend might expect them to be flattened or named 'user' and 'slot'.
        // The previous drizzle query returned: { ...booking, slot, user }
        // Mongoose populate replaces the ID with the object in the same field path.
      };
    });
  }

  async getBooking(id) {
    return await Booking.findById(id);
  }

  async createBooking(booking) {
    const newBooking = new Booking(booking);
    return await newBooking.save();
  }

  async cancelBooking(id) {
    return await Booking.findByIdAndUpdate(id, { status: "cancelled" }, { new: true });
  }

  async confirmBooking(id) {
    return await Booking.findByIdAndUpdate(id, { status: "confirmed" }, { new: true });
  }

  // Blocked Dates
  async getBlockedDates() {
    return await BlockedDate.find().sort({ date: 1 });
  }

  async createBlockedDate(date) {
    const blocked = new BlockedDate(date);
    return await blocked.save();
  }

  async deleteBlockedDate(id) {
    await BlockedDate.findByIdAndDelete(id);
  }

  async isDateBlocked(date) {
    const blocked = await BlockedDate.findOne({ date });
    return !!blocked;
  }
}

export const storage = new DatabaseStorage();

