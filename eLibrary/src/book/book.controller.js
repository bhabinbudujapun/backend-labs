import createHttpError from "http-errors";
import Book from "./book.model.js";

// List all books
const listBooks = async (req, res, next) => {
  try {
    const books = await Book.find().populate("author", "name");
    res.json(books);
  } catch (error) {
    return next(createHttpError(500, "Error fetching books"));
  }
};

// Get single books by ID
const getSingleBook = async (req, res, next) => {
  const bookId = req.params.bookId;
  try {
    const book = await Book.findOne({ _id: bookId }).populate("author", "name");

    if (!book) {
      return next(createHttpError(400, "Book not found!!"));
    }
    res.json(book);
  } catch (error) {
    return next(createHttpError(500, "Error fetching book"));
  }
};

// Create a new book
const createBook = async (req, res, next) => {
  const { title, genre } = req.body;
  const file = req.files;
  res.json({
    title,
    genre,
    file,
  });
};

export { listBooks, getSingleBook, createBook };

// createBook,
// updateBook,
// deleteBook,
