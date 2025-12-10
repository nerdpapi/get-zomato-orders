const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080
const swaggerDocs = require("../swagger.js");

// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const con = require('./connector') // your existing connector

// Helper validators
function isNonNegativeIntegerString(val) {
  // accepts "0", "1", "2", ... but not floats or negatives or non-numeric
  return /^\d+$/.test(String(val));
}
function isPositiveIntegerString(val) {
  return /^\d+$/.test(String(val)) && Number(val) > 0;
}

// GET /api/orders with pagination

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get paginated list of orders
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items to return (default = 10)
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Items to skip (default = 0)
 *     responses:
 *       200:
 *         description: A list of orders
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

app.get('/api/orders', (req, res) => {
  try {
    const { limit, offset } = req.query;
    const DEFAULT_LIMIT = 10;
    const DEFAULT_OFFSET = 0;

    let useDefaults = false;

    if (limit === undefined && offset === undefined) {
      useDefaults = true;
    } else {
      // If limit provided -> must be positive integer
      if (limit !== undefined && !isPositiveIntegerString(limit)) useDefaults = true;
      // If offset provided -> must be non-negative integer
      if (offset !== undefined && !isNonNegativeIntegerString(offset)) useDefaults = true;
    }

    const finalLimit = useDefaults ? DEFAULT_LIMIT : (limit !== undefined ? Number(limit) : DEFAULT_LIMIT);
    const finalOffset = useDefaults ? DEFAULT_OFFSET : (offset !== undefined ? Number(offset) : DEFAULT_OFFSET);

    // Use parameterized query to avoid injection
    // mysql module supports placeholders for LIMIT/OFFSET when passed as numbers
    const sql = 'SELECT * FROM orders LIMIT ? OFFSET ?';
    con.query(sql, [finalLimit, finalOffset], (err, rows) => {
      if (err) {
        console.error('DB error:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      // Return rows exactly as received from DB (structure unchanged)
      return res.status(200).json(rows);
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

swaggerDocs(app);

app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;
