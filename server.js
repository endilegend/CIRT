const express = require("express");
const { Pool } = require("pg"); // PostgreSQL client for Node.js
const path = require("path");
const multer = require("multer");
require("dotenv").config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (Frontend files in 'public' folder)
app.use(express.static(path.join(__dirname, "public")));

// PostgreSQL Database Connection (ensure PG_DATABASE is set to "CIRT")
const db = new Pool({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  port: process.env.PG_PORT,
  ssl: { rejectUnauthorized: false }, // Required for Render PostgreSQL
});
const cors = require("cors");
app.use(cors());

// Verify database connection
db.connect()
  .then(() => console.log("✅ Connected to PostgreSQL Database on Render!"))
  .catch((err) => console.error("❌ Database connection failed:", err));

// Default route for the home page
app.get("/", (req, res) => {
  res.send("Welcome to the CIRT Server on Render!");
});

// ✅ **1. Register User and Insert into PostgreSQL**
app.post("/register-user", async (req, res) => {
  const { uid, email, fName, lName } = req.body;
  const role = "Author"; // Default Role

  if (!uid || !email || !fName || !lName) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql =
    "INSERT INTO users (id, f_name, l_name, email, user_role) VALUES ($1, $2, $3, $4, $5)";

  try {
    await db.query(sql, [uid, fName, lName, email, role]);
    res
      .status(201)
      .json({ message: "✅ User registered in PostgreSQL successfully!" });
  } catch (err) {
    console.error("❌ Database Insert Error:", err.message, err.stack);
    res.status(500).json({ error: err.message });
  }
});

// ✅ **2. Test Database Connection**
app.get("/test-db", async (req, res) => {
  try {
    const result = await db.query("SELECT 1 + 1 AS result");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Database query failed:", err);
    res.status(500).send("Database error.");
  }
});

// ✅ **3. File Upload Setup Using Multer with Memory Storage**
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ **4. File Upload Endpoint**
app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("❌ No file uploaded.");
  }

  // Use file buffer (req.file.buffer) to insert binary data (BYTEA)
  const fileBuffer = req.file.buffer;
  const authorId = req.body.author_id || null;
  const status = "Sent";
  const type = req.body.type || "Article";

  const sql =
    "INSERT INTO article (pdf_file, author_id, status, type) VALUES ($1, $2, $3, $4)";

  try {
    await db.query(sql, [fileBuffer, authorId, status, type]);
    res.send({ message: "✅ File uploaded successfully" });
  } catch (err) {
    console.error("❌ Database Insertion Error:", err);
    res.status(500).send("Database error.");
  }
});

// ✅ **5. Fetch All Articles**
app.get("/articles", async (req, res) => {
  try {
    const results = await db.query("SELECT * FROM article");
    res.json(results.rows);
  } catch (err) {
    console.error("❌ Database Query Error:", err);
    res.status(500).send("Database error.");
  }
});

// ✅ **6. Fetch a Specific Article by ID**
app.get("/articles/:id", async (req, res) => {
  const articleId = req.params.id;
  try {
    const result = await db.query("SELECT * FROM article WHERE id = $1", [
      articleId,
    ]);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Database Query Error:", err);
    res.status(500).send("Database error.");
  }
});

// ✅ **7. Start the Server**
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT} (Render)`);
});
