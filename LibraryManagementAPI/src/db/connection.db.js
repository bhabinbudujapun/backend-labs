// SQLite database connection setup
import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

// Resolve __dirname in ES module context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Absolute path to the SQLite database file
const dbPath = path.resolve(__dirname, "../database.sqlite");

// Create and connect to the SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Failed to connect to SQLite:", err.message);
  } else {
    console.log("Connected to SQLite database");
  }
});

export default db;
