import { config } from "./config.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    console.log(config.PORT);
    console.log(config.MONGODB_URI);
    console.log(config.MONGODB_URI);
    await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected Successfully!");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1); // Exit process on failure
  }
};

export default connectDB;

// import dotenv from "dotenv";
// dotenv.config(); // ✅ Loads .env variables

// import mongoose from "mongoose";

// const connectDB = async () => {
//   try {
//     const mongoURI = process.env.MONGODB_URI; // ✅ Fetching URI from .env
//     if (!mongoURI) throw new Error("MongoDB URI is missing!");

//     await mongoose.connect(mongoURI);

//     console.log("✅ MongoDB Connected Successfully!");
//   } catch (error) {
//     console.error("❌ MongoDB Connection Failed:", error.message);
//     process.exit(1); // Exit process if connection fails
//   }
// };

// export default connectDB;
