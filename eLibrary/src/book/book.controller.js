// Import required modules and utilities
import createHttpError from "http-errors"; // For custom HTTP error handling
import Book from "./book.model.js"; // Book model (MongoDB via Mongoose)
import cloudinary from "../config/cloudinary.js"; // Cloudinary config for uploading files
import path, { dirname } from "path"; // Path utilities
import { fileURLToPath } from "url"; // Convert URL to file path
import fs from "node:fs"; // File system module for deleting files

// ==============================
// Get a list of all books
// ==============================
const listBooks = async (req, res, next) => {
  try {
    const books = await Book.find(); // Fetch all books from DB
    res.json(books); // Send list of books as JSON
  } catch (error) {
    return next(createHttpError(500, "Error fetching books")); // Handle DB error
  }
};

// ==============================
// Get a single book by ID
// ==============================
const getSingleBook = async (req, res, next) => {
  const bookId = req.params.bookId;
  try {
    const book = await Book.findOne({ _id: bookId }).populate("author", "name"); // Fetch book with author's name

    if (!book) {
      return next(createHttpError(400, "Book not found!!"));
    }

    res.json(book); // Send found book
  } catch (error) {
    return next(createHttpError(500, "Error fetching book")); // Handle DB error
  }
};

// ==============================
// Create a new book entry
// ==============================
const createBook = async (req, res, next) => {
  const { title, description, genre } = req.body;
  const files = req.files; // Uploaded files

  // Extract and prepare cover image path
  const coverImageType = files.coverImage[0].mimetype.split("/").at(-1);
  const coverImageFileName = files.coverImage[0].filename;
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const coverImageFilePath = path.resolve(
    __dirname,
    "../../public/data/uploads",
    coverImageFileName
  );

  try {
    // Upload cover image to Cloudinary
    const coverImageUpload = await cloudinary.uploader.upload(
      coverImageFilePath,
      {
        filename_override: coverImageFileName,
        folder: "book-covers",
        format: coverImageType,
      }
    );

    // Extract and prepare book file path
    const bookFileType = files.file[0].mimetype.split("/").at(-1);
    const bookFileName = files.file[0].filename;
    const _dirname = dirname(fileURLToPath(import.meta.url));
    const bookFilePath = path.resolve(
      _dirname,
      "../../public/data/uploads",
      bookFileName
    );

    // Upload book file (PDF) to Cloudinary
    const bookFileUpload = await cloudinary.uploader.upload(bookFilePath, {
      resource_type: "raw", // Since it's a non-image file
      filename_override: bookFileName,
      folder: "book-pdfs",
      format: bookFileType,
    });

    // Create new book entry in database
    const registerBook = await Book.create({
      title,
      description,
      author: req.userId, // Set current logged-in user as author
      coverImage: coverImageUpload.secure_url,
      file: bookFileUpload.secure_url,
      genre,
    });

    // Remove uploaded files from local storage
    await fs.promises.unlink(coverImageFilePath);
    await fs.promises.unlink(bookFilePath);

    res.status(201).json({
      message: "Successfully, book added!!",
      id: registerBook._id,
    });
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, "Error while uploading the file"));
  }
};

// ==============================
// Update an existing book
// ==============================
const updateBook = async (req, res, next) => {
  const { title, description, genre } = req.body;
  const bookId = req.params.bookId;

  // Find the book to update
  const book = await Book.findOne({ _id: bookId });
  if (!book) {
    return next(createHttpError(404, "Book not found!!"));
  }

  // Check ownership
  if (book.author.toString() !== req.userId) {
    return next(createHttpError(403, "Can not update others book!!"));
  }

  try {
    const files = req.files;

    // Update cover image if provided
    let updatedCoverImage = "";
    if (files.coverImage) {
      const coverImageType = files.coverImage[0].mimetype.split("/").at(-1);
      const coverImageFileName = files.coverImage[0].filename;
      const __dirname = dirname(fileURLToPath(import.meta.url));
      const coverImageFilePath = path.resolve(
        __dirname,
        "../../public/data/upload",
        coverImageFileName
      );
      const coverImageUpload = await cloudinary.uploader.upload(
        coverImageFileName,
        {
          filename_override: coverImageFileName,
          folder: "book-covers",
          format: coverImageType,
        }
      );
      updatedCoverImage = coverImageUpload.secure_url;
      await fs.promises.unlink(coverImageFilePath); // Delete local image
    }

    // Update book file if provided
    let updatedFile = "";
    if (files.file) {
      const bookFileType = files.file[0].mimetype.split("/").at(-1);
      const bookFileName = files.file[0].filename;
      const __dirname = dirname(fileURLToPath(import.meta.url));
      const bookFilePath = path.resolve(
        __dirname,
        "../../public/data/uploads",
        bookFileName
      );
      const bookFileUpload = await cloudinary.uploader.upload(bookFileName, {
        resource_type: "raw",
        filename_override: bookFileName,
        folder: "book-pdfs",
        format: bookFileType,
      });
      updatedFile = bookFileUpload.secure_url;
      await fs.promises.unlink(bookFilePath); // Delete local PDF
    }

    // Update book in database
    const updateBook = await Book.findOneAndUpdate(
      { _id: bookId },
      {
        title,
        description,
        genre,
        coverImage: updatedCoverImage || book.coverImage,
        file: updatedFile || book.file,
      },
      { new: true } // Return updated document
    );

    res.status(200).json({
      message: "Book updated successfully!!",
      updateBook,
    });
  } catch (error) {
    console.log(error);
    return next(createHttpError(400, "Unexpected error occurance!!"));
  }
};

// ==============================
// Delete a book
// ==============================
const deleteBook = async (req, res, next) => {
  const bookId = req.params.bookId;
  const book = await Book.findOne({ _id: bookId });

  if (!book) {
    return next(createHttpError(404, "Book not found!!"));
  }

  // Check ownership
  if (book.author.toString() !== req.userId) {
    return next(createHttpError(403, "Not allow to edit other books!!"));
  }

  // Get public IDs for Cloudinary deletion
  const coverImageUrl = book.coverImage.split("/");
  const coverImagePublicId =
    coverImageUrl.at(-2) + "/" + coverImageUrl.at(-1).split(".").at(0);

  const fileUrl = book.file.split("/");
  const filePublicId = fileUrl.at(-2) + "/" + fileUrl.at(-1);

  try {
    // Delete files from Cloudinary
    await cloudinary.uploader.destroy(coverImagePublicId);
    await cloudinary.uploader.destroy(filePublicId);
  } catch (error) {
    return next(createHttpError(400, "Unable to delete the file!!"));
  }

  // Delete the book document
  await book.deleteOne({ _id: bookId });

  return res.sendStatus(204); // Success with no content
};

// Export all handlers
export { listBooks, getSingleBook, createBook, updateBook, deleteBook };
