const mysql = require('mysql');
const { promisify } = require('util');
require('dotenv').config(); // Load environment variables from .env file


const connection = mysql.createConnection({
  host:'127.0.0.1',   // host:process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Convert callback-based methods to promise-based
const queryAsync = promisify(connection.query).bind(connection);

module.exports = { queryAsync };