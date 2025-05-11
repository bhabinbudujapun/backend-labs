import express from "express";
import { createBook, listBooks } from "./book.controller.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import multer from "multer";

const bookRoute = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"),
  limits: { fileSize: 3e7 },
});

bookRoute.post(
  "/",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createBook
);

bookRoute.get("/", listBooks);

export default bookRoute;
