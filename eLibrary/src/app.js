import express from "express";
import cors from "cors";
import { config } from "./config/config.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import userRoute from "./user/user.route.js";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

app.use(
  cors({
    origin: config.FRONTEND_DOMAIN,
  })
);

app.get("/", (req, res) => {
  res.send("Welcome to our web application !!");
});

app.use("/api/users/", userRoute);

app.use(globalErrorHandler);

export default app;
