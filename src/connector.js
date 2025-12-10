var mysql = require('mysql');

var con = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true,
    ssl: { rejectUnauthorized: false }   // IMPORTANT for Aiven MySQL
});

con.connect(function (err) {
    if (err) {
        console.log("failed to connect to mysql server/ database", err);
    } else {
        console.log("connection established with Database!!!!");
    }
});

module.exports = con;
