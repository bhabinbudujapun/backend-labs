import { config } from "./config.js";
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(config.databaseUrl);
    console.log("✅ MongoDB Connected Successfully!");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1); // Exit process on failure
  }
};

export default connectDB;
