import { app } from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./db/index.js";

dotenv.config({
  path: "./src/.env",
});

const PORT = process.env.PORT || 8080;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`⚙️ Server is running on ${PORT}`);
    });
    console.log("Connected to MongoDB Atlas successfully!");
  })
  .catch((error) => {
    console.log("MongoDB connection error: ", error);
  });
