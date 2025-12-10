// src/connector.js
// Uses mysql2 (callback API) so you can keep existing con.query(...) usage.

const mysql = require('mysql2');

const con = mysql.createConnection({
  host: process.env.DB_HOST || 'zomato-clone-zomato-clone.j.aivencloud.com',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 15144,
  user: process.env.DB_USER || 'avnadmin',
  password: process.env.DB_PASSWORD || 'AVNS_Vm6dgTBxjQhfc5V_eI3',
  database: process.env.DB_NAME || 'defaultdb',
  multipleStatements: true,
  // Aiven requires TLS — keep this.
  ssl: { rejectUnauthorized: false }
});

con.connect(function (err) {
  if (err) {
    console.error('failed to connect to mysql server/ database', err);
  } else {
    console.log('connection established with Database!!!!');
  }
});

module.exports = con;
