import dotenv from "dotenv";

dotenv.config();

const _config = {
  PORT: process.env.PORT,
  FRONTEND_DOMAIN: process.env.FRONTEND_DOMAIN,
  MONGO_CONNECTION_STRING: process.env.MONGO_CONNECTION_STRING,
};

// Ensures that config remains read-only
export const config = Object.freeze(_config);
