import dotenv from "dotenv";

dotenv.config();

const _config = {
  port: process.env.PORT,
  frontendDomain: process.env.FRONTEND_DOMAIN,
  databaseUrl: process.env.MONGO_CONNECTION_STRING,
  nodeEnv: process.env.NODE_ENV,
  secretKey: process.env.SECRET_KEY,
  cloudName: process.env.CLOUDINARY_NAME,
  cloudApiSecret: process.env.CLOUDINARY_API_SECRET,
  cloudApiKey: process.env.CLOUDINARY_API_KEY,
};

// Ensures that config remains read-only
export const config = Object.freeze(_config);
