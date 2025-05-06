import { config } from "./src/config/config.js";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";

const startServer = async () => {
  await connectDB(); // Connect to MongoDB before starting the server

  const PORT = config.PORT || 8000;

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();
