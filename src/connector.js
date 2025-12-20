// src/connector.js
// MySQL connection pool (callback API) – SAFE for Render + Aiven

const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "zomato-clone-zomato-clone.j.aivencloud.com",
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 15144,
  user: process.env.DB_USER || "avnadmin",
  password: process.env.DB_PASSWORD || "AVNS_Vm6dgTBxjQhfc5V_eI3",
  database: process.env.DB_NAME || "defaultdb",

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  // Aiven requires TLS
  ssl: { rejectUnauthorized: false }
});

// Optional startup check
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ MySQL pool connection failed:", err);
  } else {
    console.log("✅ MySQL pool connected successfully");
    connection.release();
  }
});

module.exports = pool;
