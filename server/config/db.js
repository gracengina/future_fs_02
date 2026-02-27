const mysql = require('mysql2');
require('dotenv').config();

// Create the connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Convert the pool to use Promises (allows async/await)
const promisePool = pool.promise();

// Immediate Connection Test
// This runs once when the app starts to verify your .env credentials
async function testConnection() {
  try {
    const connection = await promisePool.getConnection();
    console.log(' Database connected successfully to:', process.env.DB_NAME);
    connection.release(); // Return the connection to the pool
  } catch (err) {
    console.error(' Database connection failed!');
    console.error('Error Details:', err.message);
    
    // Peer tip: Check if your MySQL service is running or if the password in .env is correct.
  }
}

testConnection();

module.exports = promisePool;