const con = require("./connector");
const data = require("./data");

async function createDatabase() {
  try {
    // Create table if it doesn't exist
    await new Promise((resolve, reject) => {
      con.query(
        `CREATE TABLE IF NOT EXISTS orders (
          _id VARCHAR(200) PRIMARY KEY,
          title VARCHAR(100),
          description VARCHAR(1000)
        )`,
        (err) => (err ? reject(err) : resolve())
      );
    });

    // Check if data already exists
    const [rows] = await new Promise((resolve, reject) => {
      con.query("SELECT COUNT(*) AS count FROM orders", (err, rows) =>
        err ? reject(err) : resolve([rows])
      );
    });

    if (rows[0].count > 0) {
      console.log("ℹ️ Orders already seeded");
      return;
    }

    // Insert data safely
    for (const item of data) {
      await new Promise((resolve, reject) => {
        con.query(
          "INSERT INTO orders (_id, title, description) VALUES (?, ?, ?)",
          [item._id, item.title, item.description],
          (err) => (err ? reject(err) : resolve())
        );
      });
    }

    console.log("✅ Orders table seeded successfully");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    throw err;
  }
}

module.exports = createDatabase;
