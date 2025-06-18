import express from "express";
import cors from "cors";
import { config } from "./config/config.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import userRoute from "./user/user.route.js";
import bodyParser from "body-parser";
import bookRoute from "./book/book.route.js";

const app = express();
app.use(bodyParser.json());

app.use(
  cors({
    origin: config.frontendDomain,
  })
);

app.get("/", (req, res) => {
  res.send(`Welcome to our web application !! ${config.frontendDomain}`);
});

app.use("/api/users/", userRoute);

app.use("/api/books/", bookRoute);

app.use(globalErrorHandler);

export default app;
