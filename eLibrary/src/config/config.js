import dotenv from "dotenv";

dotenv.config();

const _config = {
  port: process.env.PORT,
  frontendDomain: process.env.FRONTEND_DOMAIN,
  databaseUrl: process.env.MONGO_CONNECTION_STRING,
  nodeEnv: process.env.NODE_ENV,
  secretKey: process.env.SECRET_KEY,
};

// Ensures that config remains read-only
export const config = Object.freeze(_config);
