import mongoose from "mongoose";

// Define the schema for a User
const userSchema = new mongoose.Schema(
  {
    // User's full name (required)
    name: {
      type: String,
      required: true,
    },

    // User's email address (must be unique and required)
    email: {
      type: String,
      unique: true,
      required: true,
    },

    // User's hashed password (required)
    password: {
      type: String,
      required: true,
    },
  },

  // Automatically include createdAt and updatedAt timestamps
  { timestamps: true }
);

// Create the User model using the schema
const User = mongoose.model("User", userSchema);

// Export the model for use in other files
export default User;
