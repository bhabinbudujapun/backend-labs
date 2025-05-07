import { config } from "../config/config.js";

const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500; // Defaults to 500 if no status code is provided

  res.status(statusCode).json({
    statusCode: statusCode,
    message: err.message || "Internal Server Error",
    errorStack: config.nodeEnv === "development" ? err.stack : "", // Only show stack trace in development
  });
};

export default globalErrorHandler;
