// Migration script to initialize SQLite schema
import db from "./connection.db.js";

db.serialize(() => {
  // Create authors table
  db.run(`
    CREATE TABLE IF NOT EXISTS authors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create books table with foreign key to authors
  db.run(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      isbn TEXT UNIQUE NOT NULL,
      published_year INTEGER,
      author_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(author_id) REFERENCES authors(id)
    )
  `);

  console.log("Migration completed: Tables created or verified.");
});

// Close the database connection
db.close();
