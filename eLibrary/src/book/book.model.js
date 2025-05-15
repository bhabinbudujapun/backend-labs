// Import mongoose to define schema and model
import mongoose from "mongoose";

// Define the schema for a Book document
const bookSchema = new mongoose.Schema(
  {
    // Title of the book (required string)
    title: {
      type: String,
      required: true,
    },

    // Description or summary of the book (required string)
    description: {
      type: String,
      required: true,
    },

    // Author of the book (referenced from User collection)
    // Stored as ObjectId for relational population
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // URL of the uploaded cover image stored in Cloudinary
    coverImage: {
      type: String,
      required: true,
    },

    // URL of the uploaded book file (e.g., PDF)
    file: {
      type: String,
      required: true,
    },

    // Genre of the book (e.g., Fiction, Sci-fi)
    genre: {
      type: String,
      required: true,
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

// Create a Mongoose model from the schema
const Book = mongoose.model("Book", bookSchema);

// Export the model to use in controllers and routes
export default Book;
