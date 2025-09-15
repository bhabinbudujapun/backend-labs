import http from "http";
import { parse } from "url";
import bookRoute from "./src/routes/book.route.js";
import authorRoute from "./src/routes/author.route.js";
import { sendResponse } from "./src/utils/api.util.js";

const PORT = 3000;

// Create HTTP server
const server = http.createServer((req, res) => {
  // Parse URL and extract route segments
  const parsedUrl = parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const route = pathname.split("/").filter(Boolean);

  // Route: /authors
  if (route[0] === "authors") {
    authorRoute(req, res);
  }

  // Route: /books
  else if (route[0] === "books") {
    bookRoute(req, res);
  }

  // Route not matched
  else {
    sendResponse(res, 404, "error", "Route not found");
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
