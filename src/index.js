const express = require("express");
const swaggerDocs = require("../swagger");
const con = require("./connector");
const createDatabase = require("./createDatabase");

const app = express();
const port = 8080;

// ✅ Built-in body parsers (replace body-parser)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// ---------------- HELPERS ----------------
function isNonNegativeIntegerString(val) {
  return /^\d+$/.test(String(val));
}

function isPositiveIntegerString(val) {
  return /^\d+$/.test(String(val)) && Number(val) > 0;
}

// ---------------- ROUTES ----------------

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     responses:
 *       200:
 *         description: Server is running
 */
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get paginated list of orders
 *     description: Returns orders with optional pagination
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           example: 0
 *     responses:
 *       200:
 *         description: List of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 */
app.get("/api/orders", (req, res) => {
  const { limit, offset } = req.query;

  const finalLimit = isPositiveIntegerString(limit)
    ? Number(limit)
    : 10;

  const finalOffset = isNonNegativeIntegerString(offset)
    ? Number(offset)
    : 0;

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

// ---------------- SWAGGER ----------------
swaggerDocs(app);

// ---------------- SERVER START ----------------
// ✅ Start server even if DB is temporarily unavailable
(async () => {
  try {
    await createDatabase();
    console.log("✅ Database ready");
  } catch (err) {
    console.error("⚠️ Database not ready yet, continuing...", err.message);
  }

  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
})();

module.exports = app;
