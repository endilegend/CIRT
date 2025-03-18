// backend/db.js
const { Pool } = require("pg");
require("dotenv").config(); // Load environment variables

// PostgreSQL Database Connection (Replace with your Render DB details)
const pool = new Pool({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  port: process.env.PG_PORT,
  ssl: { rejectUnauthorized: false }, // Required for Render PostgreSQL
});

// Connect to PostgreSQL and check for errors
pool
  .connect()
  .then(() => console.log("✅ Connected to PostgreSQL Database on Render!"))
  .catch((err) => console.error("❌ Database connection failed:", err));

// Export the connection pool
module.exports = pool;
