const mysql = require("mysql2/promise");

// Create connection pool
const pool = mysql.createPool({
  host: "localhost",
  user: "ankush_udapure", // your MySQL user
  password: "ADsql@25", // your MySQL password
  database: "ratings_app",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
