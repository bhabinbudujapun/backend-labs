import express from "express";
import cors from "cors";
import { config } from "./config/config.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import createHttpError from "http-errors";

const app = express();

app.use(
  cors({
    origin: config.FRONTEND_DOMAIN,
  })
);

app.get("/", (req, res, next) => {
  next(createHttpError(401, "Bad Request !!"));
});

app.use(globalErrorHandler);

export default app;
