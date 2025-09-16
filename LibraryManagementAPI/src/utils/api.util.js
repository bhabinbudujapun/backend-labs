// Sends a structured JSON response to the client
function sendResponse(res, code, status, message, data = null) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json");
  res.end(
    JSON.stringify({
      code,
      status,
      message,
      ...(data && { data }),
    })
  );
}

// Parses the incoming request body
function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const parsed = JSON.parse(body);
        resolve(parsed);
      } catch (error) {
        reject(new Error("Invalid JSON"));
      }
    });
  });
}

// Extract Query Params
function extractQueryParams(pathname, query) {
  const result = {
    filters: {},
    sort: null,
    order: "desc", // default sort order
  };

  if (pathname === "/authors") {
    if (query.name) {
      result.filters.name = query.name.toLowerCase(); // partial match
    }

    if (query.sort === "books") {
      result.sort = "books";
    }

    if (query.order === "asc" || query.order === "desc") {
      result.order = query.order;
    }
  } else if (pathname === "/books") {
    if (query.title) {
      result.filters.title = query.title.toLowerCase(); // partial match
    }

    if (query.author) {
      result.filters.author = query.author.toLowerCase();
    }

    if (query.year && /^\d{4}$/.test(query.year)) {
      result.filters.year = parseInt(query.year, 10);
    }

    const validSortFields = ["title", "published_year", "created_at"];
    if (validSortFields.includes(query.sort)) {
      result.sort = query.sort;
    }

    if (query.order === "asc" || query.order === "desc") {
      result.order = query.order;
    }
  }

  return result;
}

export { sendResponse, getRequestBody, extractQueryParams };
