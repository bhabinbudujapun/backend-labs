import url from "url";
import db from "../db/connection.db.js";
import {
  sendResponse,
  extractQueryParams,
  getRequestBody,
} from "../utils/api.util.js";

// GET /authors
export const getAuthor = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const { pathname, query } = parsedUrl;

  const { filters } = extractQueryParams(pathname, query);

  // Base SQL query with LEFT JOIN to count books
  let sql = `
    SELECT authors.*, COUNT(books.id) AS book_count
    FROM authors
    LEFT JOIN books ON books.author_id = authors.id
  `;
  const params = [];

  // Apply name filter (case-insensitive partial match)
  if (filters.name) {
    sql += ` WHERE LOWER(authors.name) LIKE ?`;
    params.push(`%${filters.name}%`);
  }

  // Group by author to aggregate book count
  sql += ` GROUP BY authors.id`;

  // Execute query
  db.all(sql, params, (err, rows) => {
    if (err) {
      return sendResponse(res, 500, "error", "Database error", {
        error: err.message,
      });
    }

    sendResponse(res, 200, "success", "Authors retrieved successfully", rows);
  });
};

// POST /authors
export const createAuthor = async (req, res) => {
  try {
    const body = await getRequestBody(req);
    const { name, email } = body;

    // Validate name
    if (!name || name.trim().length < 2) {
      return sendResponse(
        res,
        400,
        "fail",
        "Name must be at least 2 characters long"
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return sendResponse(res, 400, "fail", "Invalid email format");
    }

    // Insert into database
    const sql = `INSERT INTO authors (name, email) VALUES (?, ?)`;
    db.run(sql, [name.trim(), email.trim()], function (err) {
      if (err) {
        return sendResponse(res, 500, "error", "Database error", {
          error: err.message,
        });
      }

      // Respond with created author info
      const newAuthor = {
        id: this.lastID,
        name: name.trim(),
        email: email.trim(),
      };

      sendResponse(
        res,
        201,
        "success",
        "Author created successfully",
        newAuthor
      );
    });
  } catch (error) {
    sendResponse(res, 400, "fail", error.message);
  }
};
