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

const bookRoute = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"),
  limits: { fileSize: 3e7 },
});

bookRoute.post(
  "/",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createBook
);

bookRoute.patch(
  "/:bookId",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  updateBook
);

bookRoute.get("/", listBooks);
bookRoute.get("/:bookId", getSingleBook);
bookRoute.delete("/:bookId", authenticate, deleteBook);

export default bookRoute;
