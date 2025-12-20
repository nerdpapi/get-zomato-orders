const express = require("express");
const bodyParser = require("body-parser");
const swaggerDocs = require("../swagger.js");
const con = require("./connector");
const seedDB = require("./seed");

const app = express();
const port = 8080;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Helpers
function isNonNegativeIntegerString(val) {
  return /^\d+$/.test(String(val));
}
function isPositiveIntegerString(val) {
  return /^\d+$/.test(String(val)) && Number(val) > 0;
}

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Orders API
app.get("/api/orders", (req, res) => {
  const { limit, offset } = req.query;

  const finalLimit =
    isPositiveIntegerString(limit) ? Number(limit) : 10;
  const finalOffset =
    isNonNegativeIntegerString(offset) ? Number(offset) : 0;

  con.query(
    "SELECT * FROM orders LIMIT ? OFFSET ?",
    [finalLimit, finalOffset],
    (err, rows) => {
      if (err) {
        console.error("DB error:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json(rows);
    }
  );
});

// Swagger
swaggerDocs(app);

// Start server ONLY after DB ready
seedDB()
  .then(() => {
    app.listen(port, () =>
      console.log(`🚀 Server running on port ${port}`)
    );
  })
  .catch(() => {
    console.error("❌ Server not started due to DB error");
  });

module.exports = app;
