import url from "url";
import db from "../db/connection.db.js";
import {
  sendResponse,
  extractQueryParams,
  getRequestBody,
} from "../utils/api.util.js";

// GET /books
export const getBook = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const { pathname, query } = parsedUrl;
  const { filters, sort, order } = extractQueryParams(pathname, query);

  let sql = `SELECT * FROM books`;
  const conditions = [];
  const params = [];

  // Title filter (case-insensitive partial match)
  if (filters.title) {
    conditions.push(`LOWER(title) LIKE ?`);
    params.push(`%${filters.title.toLowerCase()}%`);
  }

  // Author filter (case-insensitive partial match)
  if (filters.author) {
    conditions.push(`LOWER(author) LIKE ?`);
    params.push(`%${filters.author.toLowerCase()}%`);
  }

  // Year filter (exact match)
  if (filters.year) {
    conditions.push(`published_year = ?`);
    params.push(filters.year);
  }

  // Add WHERE clause if filters exist
  if (conditions.length > 0) {
    sql += ` WHERE ` + conditions.join(" AND ");
  }

  // Apply sorting if valid
  const validSortFields = ["title", "published_year", "created_at"];
  if (validSortFields.includes(sort)) {
    const sortOrder = order === "asc" ? "ASC" : "DESC";
    sql += ` ORDER BY ${sort} ${sortOrder}`;
  }

  // Execute query
  db.all(sql, params, (err, rows) => {
    if (err) {
      return sendResponse(res, 500, "error", "Failed to fetch books", {
        error: err.message,
      });
    }

    sendResponse(res, 200, "success", "Successfully fetched books", rows);
  });
};

//  POST /books
export const createBook = async (req, res) => {
  try {
    const body = await getRequestBody(req);
    const { title, published_year, isbn, author_id } = body;

    // Validation title
    if (!title || title.trim().length < 1) {
      return sendResponse(
        res,
        400,
        "fail",
        "Title must be at least 1 character long"
      );
    }

    // Validate published year (optional but must be 4-digit if provided)
    const yearRegex = /^\d{4}$/;
    if (published_year && !yearRegex.test(published_year)) {
      return sendResponse(
        res,
        400,
        "fail",
        "Published year must be a valid 4-digit year"
      );
    }

    // Validate ISBN (exactly 10 digits)
    const isbnRegex = /^\d{10}$/;
    if (!isbn || !isbnRegex.test(isbn)) {
      return sendResponse(res, 400, "fail", "ISBN must be exactly 10 digits");
    }

    // Validate author ID
    if (!author_id || isNaN(author_id)) {
      return sendResponse(
        res,
        400,
        "fail",
        "Author ID is required and must be a number"
      );
    }

    // Insert into database
    const sql = `
      INSERT INTO books (title, published_year, isbn, author_id)
      VALUES (?, ?, ?, ?)
    `;
    db.run(
      sql,
      [title.trim(), published_year, isbn, author_id],
      function (err) {
        if (err) {
          return sendResponse(res, 500, "error", "Database error", {
            error: err.message,
          });
        }

        const newBook = {
          id: this.lastID,
          title: title.trim(),
          published_year,
          isbn,
          author_id,
        };

        sendResponse(res, 201, "success", "Book created successfully", newBook);
      }
    );
  } catch (error) {
    sendResponse(res, 400, "fail", error.message);
  }
};

// PUT /books/:id
export const updateBook = async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const id = parseInt(parsedUrl.pathname.split("/").pop());

  if (isNaN(id)) {
    return sendResponse(res, 400, "fail", "Invalid book ID");
  }

  try {
    const body = await getRequestBody(req);
    const { title, published_year, isbn, author_id } = body;

    // Validate title
    if (!title || title.trim().length < 1) {
      return sendResponse(
        res,
        400,
        "fail",
        "Title must be at least 1 character long"
      );
    }

    // Validate published year (optional but must be 4-digit if provided)
    const yearRegex = /^\d{4}$/;
    if (published_year && !yearRegex.test(published_year)) {
      return sendResponse(
        res,
        400,
        "fail",
        "Published year must be a valid 4-digit year"
      );
    }

    // Validate ISBN (exactly 10 digits)
    const isbnRegex = /^\d{10}$/;
    if (!isbn || !isbnRegex.test(isbn)) {
      return sendResponse(res, 400, "fail", "ISBN must be exactly 10 digits");
    }

    // Validate author ID
    if (!author_id || isNaN(author_id)) {
      return sendResponse(
        res,
        400,
        "fail",
        "Author ID is required and must be a number"
      );
    }

    // Update query
    const sql = `
      UPDATE books
      SET title = ?, published_year = ?, isbn = ?, author_id = ?
      WHERE id = ?
    `;
    const params = [title.trim(), published_year, isbn, author_id, id];

    db.run(sql, params, function (err) {
      if (err) {
        return sendResponse(res, 500, "error", "Database error", {
          error: err.message,
        });
      }

      if (this.changes === 0) {
        return sendResponse(res, 404, "fail", "Book not found");
      }

      const updatedBook = {
        id,
        title: title.trim(),
        published_year,
        isbn,
        author_id,
      };

      sendResponse(
        res,
        200,
        "success",
        "Book updated successfully",
        updatedBook
      );
    });
  } catch (error) {
    sendResponse(res, 400, "fail", error.message);
  }
};
