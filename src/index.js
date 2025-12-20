const express = require("express");
const bodyParser = require("body-parser");
const swaggerDocs = require("../swagger.js");
const con = require("./connector");

const app = express();
const port = 8080;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ---------------- HELPERS ----------------
function isNonNegativeIntegerString(val) {
  return /^\d+$/.test(String(val));
}

function isPositiveIntegerString(val) {
  return /^\d+$/.test(String(val)) && Number(val) > 0;
}

// ---------------- ROUTES ----------------

// Health check (VERY useful on Render)
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// GET /api/orders (paginated)
app.get("/api/orders", (req, res) => {
  try {
    const { limit, offset } = req.query;

    const DEFAULT_LIMIT = 10;
    const DEFAULT_OFFSET = 0;

    let useDefaults = false;

    if (limit === undefined && offset === undefined) {
      useDefaults = true;
    } else {
      if (limit !== undefined && !isPositiveIntegerString(limit)) useDefaults = true;
      if (offset !== undefined && !isNonNegativeIntegerString(offset)) useDefaults = true;
    }

    const finalLimit = useDefaults
      ? DEFAULT_LIMIT
      : limit !== undefined
      ? Number(limit)
      : DEFAULT_LIMIT;

    const finalOffset = useDefaults
      ? DEFAULT_OFFSET
      : offset !== undefined
      ? Number(offset)
      : DEFAULT_OFFSET;

    const sql = "SELECT * FROM orders LIMIT ? OFFSET ?";

    con.query(sql, [finalLimit, finalOffset], (err, rows) => {
      if (err) {
        console.error("DB error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      return res.status(200).json(rows);
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Swagger
swaggerDocs(app);

// Server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

module.exports = app;
