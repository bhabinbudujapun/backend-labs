import createHttpError from "http-errors";
import Book from "./book.model.js";
import cloudinary from "../config/cloudinary.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "node:fs";

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
  const { title, genre, description } = req.body;
  const files = req.files;

  const coverImageType = files.coverImage[0].mimetype.split("/").at(-1);
  const coverImageFileName = files.coverImage[0].filename;
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const coverImageFilePath = path.resolve(
    __dirname,
    "../../public/data/uploads",
    coverImageFileName
  );

  try {
    const coverImageUpload = await cloudinary.uploader.upload(
      coverImageFilePath,
      {
        filename_override: coverImageFileName,
        folder: "book-covers",
        format: coverImageType,
      }
    );

    const bookFileType = files.file[0].mimetype.split("/").at(-1);
    const bookFileName = files.file[0].filename;
    const _dirname = dirname(fileURLToPath(import.meta.url));
    const bookFilePath = path.resolve(
      _dirname,
      "../../public/data/uploads",
      bookFileName
    );

    const bookFileUpload = await cloudinary.uploader.upload(bookFilePath, {
      resource_type: "raw",
      filename_override: bookFileName,
      folder: "book-pdfs",
      format: bookFileType,
    });

    console.log(coverImageUpload);
    console.log(bookFileUpload);

    await fs.promises.unlink(coverImageFilePath);
    await fs.promises.unlink(bookFilePath);

    res.status(201).json({ message: "Successfully, book added!!" });
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, "Error while uploading the file"));
  }
};

export { listBooks, getSingleBook, createBook };
