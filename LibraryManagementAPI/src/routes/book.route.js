import {
  getBook,
  createBook,
  updateBook,
} from "../controllers/book.controller.js";
import { sendResponse } from "../utils/api.util.js";

// Handles routing for /books endpoint.
const bookRoute = (req, res) => {
  switch (req.method) {
    // Fetch books
    case "GET":
      return getBook(req, res);

    case "POST":
      // Create a new book (title, isbn, year, author_id)
      return createBook(req, res);

    // Update an existing book by ID
    case "PUT":
      return updateBook(req, res);

    // Method not allowed for /books
    default:
      return sendResponse(res, 405, "error", "Method Not Allowed");
  }
};

export default bookRoute;
