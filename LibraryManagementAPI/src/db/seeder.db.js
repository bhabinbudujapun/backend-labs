// Seed script to populate authors and books tables with dummy data
import db from "./connection.db.js";

db.serialize(() => {
  // Clear existing data
  db.run("DELETE FROM books");
  db.run("DELETE FROM authors");

  // Insert dummy authors
  db.run(`
    INSERT INTO authors (name, email) VALUES
    ('Robert Martin', 'robert.martin@example.com'),
    ('Douglas Crockford', 'douglas.crockford@example.com'),
    ('Kyle Simpson', 'kyle.simpson@example.com'),
    ('Marijn Haverbeke', 'marijn.haverbeke@example.com'),
    ('David Flanagan', 'david.flanagan@example.com'),
    ('Eric Matthes', 'eric.matthes@example.com'),
    ('Ethan Brown', 'ethan.brown@example.com'),
    ('Andrew Hunt', 'andrew.hunt@example.com'),
    ('Steve McConnell', 'steve.mcconnell@example.com'),
    ('Jon Duckett', 'jon.duckett@example.com'),
    ('Thomas H. Cormen', 'thomas.cormen@example.com'),
    ('Gayle Laakmann McDowell', 'gayle.mcdowell@example.com'),
    ('Yukihiro Matsumoto', 'yukihiro.matsumoto@example.com'),
    ('Brendan Eich', 'brendan.eich@example.com'),
    ('Guido van Rossum', 'guido.rossum@example.com')
  `);

  // Insert dummy books
  db.run(`
    INSERT INTO books (title, isbn, published_year, author_id) VALUES
    ('Clean Code', '9780132350884', 2008, 1),
    ('JavaScript: The Good Parts', '9780596517748', 2008, 2),
    ('You Do not Know JS', '9781491904244', 2015, 3),
    ('Eloquent JavaScript', '9781593279509', 2018, 4),
    ('JavaScript: The Definitive Guide', '9780596805524', 2011, 5),
    ('Python Crash Course', '9781593279288', 2015, 6),
    ('Learning JavaScript', '9781491914915', 2016, 7),
    ('The Pragmatic Programmer', '9780201616224', 1999, 8),
    ('Code Complete', '9780735619678', 2004, 9),
    ('HTML and CSS: Design and Build Websites', '9781118008188', 2011, 10),
    ('Introduction to Algorithms', '9780262033848', 2009, 11),
    ('Cracking the Coding Interview', '9780984782857', 2015, 12),
    ('The Ruby Programming Language', '9780596516178', 2008, 13),
    ('JavaScript and the Web', '9780134546315', 2017, 14),
    ('Python Programming Fundamentals', '9780321680563', 2010, 15)
  `);

  // Close DB connection after seeding
  db.close(() => {
    console.log("Seeding completed: Dummy data inserted.");
  });
});
