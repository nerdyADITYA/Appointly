import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
  throw new Error(
    "MONGODB_URI must be set. Please check your .env file."
  );
}

// Connect to MongoDB
try {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");
} catch (err) {
  console.error("Failed to connect to MongoDB:", err);
  process.exit(1);
}

export const db = mongoose.connection;

