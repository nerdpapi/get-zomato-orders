var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",      // or "127.0.0.1" if you prefer TCP
    user: "nodeuser",
    password: "StrongPassword123!", // use the password you created
    database: "test",
    multipleStatements: true
});

con.connect(function (err) {
    if (err) return console.log("failed to connect to mysql server/ database", err);
    else return console.log("connection established with Database!!!!");
});

module.exports = con;
