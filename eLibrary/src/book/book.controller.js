import createHttpError from "http-errors";
import Book from "./book.model.js";
import cloudinary from "../config/cloudinary.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "node:fs";

// List all books
const listBooks = async (req, res, next) => {
  try {
    const books = await Book.find();
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
  const { title, description, genre } = req.body;
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

    const registerBook = await Book.create({
      title,
      description,
      author: req.userId,
      coverImage: coverImageUpload.secure_url,
      file: bookFileUpload.secure_url,
      genre,
    });

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

// Update book
const updateBook = async (req, res, next) => {
  const { title, description, genre } = req.body;
  const bookId = req.params.bookId;

  const book = await Book.findOne({ _id: bookId });

  if (!book) {
    return next(createHttpError(404, "Book not found!!"));
  }

  if (book.author.toString() !== req.userId) {
    return next(createHttpError(403, "Can not update others book!!"));
  }

  try {
    const files = req.files;

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
      await fs.promises.unlink(coverImageFilePath);
    }

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
      await fs.promises.unlink(bookFilePath);
    }

    const updateBook = await Book.findOneAndUpdate(
      {
        _id: bookId,
      },
      {
        title: title,
        description: description,
        genre: genre,
        coverImage: updatedCoverImage ? updatedCoverImage : book.coverImage,
        file: updatedFile ? updatedFile : book.file,
      },
      {
        new: true,
      }
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

// Delete book
const deleteBook = async (req, res, next) => {
  const bookId = req.params.bookId;

  const book = await Book.findOne({ _id: bookId });

  if (!book) {
    return next(createHttpError(404, "Book not found!!"));
  }

  if (book.author.toString() == !req.userId) {
    return next(createHttpError(403, "Not allow to edit other books!!"));
  }

  const coverImageUrl = book.coverImage.split("/");
  const coverImagePublicId =
    coverImageUrl.at(-2) + "/" + coverImageUrl.at(-1).split(".").at(0);

  const fileUrl = book.file.split("/");
  const filePublicId = fileUrl.at(-2) + "/" + fileUrl.at(-1);

  try {
    await cloudinary.uploader.destroy(coverImagePublicId);
    await cloudinary.uploader.destroy(filePublicId);
  } catch (error) {
    return next(createHttpError(400, "Unable to delete the file!!"));
  }

  await book.deleteOne({ _id: bookId });

  return res.sendStatus(204);
};

export { listBooks, getSingleBook, createBook, updateBook, deleteBook };
