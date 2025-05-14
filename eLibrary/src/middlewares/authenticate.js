import createHttpError from "http-errors";
import { config } from "../config/config.js";
import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return next(createHttpError(401, "Authorization token is required!!"));
  }

  const parsedToken = token.split(" ")[1];

  try {
    const decoded = jwt.verify(parsedToken, config.secretKey);
    req.userId = decoded.sub;
    next();
  } catch (error) {
    return next(createHttpError(401, "Token is expired!!"));
  }
};

export default authenticate;
