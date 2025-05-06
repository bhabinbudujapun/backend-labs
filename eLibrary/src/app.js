import express from "express";
import cors from "cors";
import { config } from "./config/config.js";

const app = express();

app.use(
  cors({
    origin: config.FRONTEND_DOMAIN,
  })
);

app.get("/", (req, res) => {
  res.send("Hello world  !!!!");
});

export default app;
