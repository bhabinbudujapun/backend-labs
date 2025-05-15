// Importing required modules and functions
import express from "express";
import {
  listBooks,
  createBook,
  updateBook,
  deleteBook,
  getSingleBook,
} from "./book.controller.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import multer from "multer";
import authenticate from "../middlewares/authenticate.js";

// Initialize express router
const bookRoute = express.Router();

// Determine __dirname for resolving file paths (needed in ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up multer for handling file uploads (e.g. cover image, book file)
// Files will be stored temporarily in /public/data/uploads with a 30MB size limit
const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"),
  limits: { fileSize: 3e7 }, // 30MB limit
});

// Route: Create a new book
// - Requires authentication
// - Accepts two files: coverImage (image) and file (PDF or other formats)
bookRoute.post(
  "/",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createBook
);

// Route: Update an existing book by ID
// - Requires authentication
// - Accepts new files to replace existing cover or book file
bookRoute.patch(
  "/:bookId",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  updateBook
);

// Route: List all books (publicly accessible)
bookRoute.get("/", listBooks);

// Route: Get a single book by ID (publicly accessible)
bookRoute.get("/:bookId", getSingleBook);

// Route: Delete a book by ID
// - Requires authentication
bookRoute.delete("/:bookId", authenticate, deleteBook);

// Export all book-related routes
export default bookRoute;
