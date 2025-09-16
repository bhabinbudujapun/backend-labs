import { getAuthor, createAuthor } from "../controllers/author.controller.js";
import { sendResponse } from "../utils/api.util.js";

//  Handles routing for /authors endpoint.
const authorRoute = (req, res) => {
  switch (req.method) {
    // Retrieve authors
    case "GET":
      return getAuthor(req, res);

    // Create a new author
    case "POST":
      return createAuthor(req, res);

    // Method not allowed for /authors
    default:
      return sendResponse(res, 405, "error", "Method Not Allowed");
  }
};

export default authorRoute;
