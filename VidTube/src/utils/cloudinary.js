import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY, // Fixed variable name
  api_secret: process.env.CLOUDINARY_API_SECRET, // Fixed variable name
  secure: true,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    // Validate input
    if (!localFilePath) {
      console.warn("No file path provided");
      return null;
    }

    // Convert to absolute path
    const absolutePath = path.resolve(localFilePath);

    // Check if file exists
    if (!fs.existsSync(absolutePath)) {
      console.warn("File not found at path:", absolutePath);
      return null;
    }

    // Upload to Cloudinary
    const response = await cloudinary.uploader.upload(absolutePath, {
      resource_type: "auto", // Fixed: added quotes
    });

    // Delete local file after successful upload
    try {
      fs.unlinkSync(absolutePath);
      console.log("Temporary file deleted:", absolutePath);
    } catch (unlinkError) {
      console.error("Error deleting temporary file:", unlinkError);
    }

    return response;
  } catch (uploadError) {
    console.error("Cloudinary upload failed:", uploadError);

    // Attempt to delete local file if upload failed
    if (localFilePath && fs.existsSync(path.resolve(localFilePath))) {
      try {
        fs.unlinkSync(path.resolve(localFilePath));
      } catch (unlinkError) {
        console.error("Error cleaning up failed upload:", unlinkError);
      }
    }

    return null;
  }
};

export { uploadOnCloudinary };
