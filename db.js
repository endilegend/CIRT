// PostgreSQL client for Node.js
const { Pool } = require("pg");
require("dotenv").config();

require("dotenv").config(); // Load environment variables

// PostgreSQL Database Connection (Replace with your Render DB details)
const pool = new Pool({
  host: process.env.PG_HOST || "dpg-cv7gktfnoe9s73aj6fmg-a",
  user: process.env.PG_USER || "cirt_user",
  password: process.env.PG_PASSWORD || "Z4VCwVjetTb0nDsDfEUoQmxc2m0hh7i6",
  database: process.env.PG_DATABASE || "cirt",
  port: process.env.PG_PORT || 5432,
  ssl: { rejectUnauthorized: false }, // Required for Render PostgreSQL
});

// Connect to PostgreSQL and check for errors
pool
  .connect()
  .then(() => console.log("✅ Connected to PostgreSQL Database on Render!"))
  .catch((err) => console.error("❌ Database connection failed:", err));

// Export the connection pool
module.exports = pool;
