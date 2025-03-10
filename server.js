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

// PostgreSQL Database Connection (from your Render database)
const db = new Pool({
  host: process.env.PG_HOST || "dpg-cv7gktfnoe9s73aj6fmg-a",
  user: process.env.PG_USER || "cirt_user",
  password: process.env.PG_PASSWORD || "Z4VCwVjetTb0nDsDfEUoQmxc2m0hh7i6",
  database: process.env.PG_DATABASE || "cirt",
  port: process.env.PG_PORT || 5432,
  ssl: { rejectUnauthorized: false }, // Required for Render PostgreSQL
});

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
    "INSERT INTO USERS (ID, F_NAME, L_NAME, EMAIL, ROLE) VALUES ($1, $2, $3, $4, $5)";

  try {
    await db.query(sql, [uid, fName, lName, email, role]);
    res
      .status(201)
      .json({ message: "✅ User registered in PostgreSQL successfully!" });
  } catch (err) {
    console.error("❌ Database Insert Error:", err);
    res.status(500).json({ error: "Database error" });
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

// ✅ **3. File Upload Setup Using Multer**
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});
const upload = multer({ storage });

// ✅ **4. File Upload Endpoint**
app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("❌ No file uploaded.");
  }

  const filePath = req.file.path;
  const authorId = req.body.author_id || null;
  const status = "Sent";
  const type = req.body.type || "Article";

  const sql =
    "INSERT INTO ARTICLE (PDF_PATH, AUTHOR_ID, STATUS, TYPE) VALUES ($1, $2, $3, $4)";

  try {
    await db.query(sql, [filePath, authorId, status, type]);
    res.send({ message: "✅ File uploaded successfully", filePath });
  } catch (err) {
    console.error("❌ Database Insertion Error:", err);
    res.status(500).send("Database error.");
  }
});

// ✅ **5. Fetch All Articles**
app.get("/articles", async (req, res) => {
  try {
    const results = await db.query("SELECT * FROM ARTICLE");
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
    const result = await db.query("SELECT * FROM ARTICLE WHERE ID = $1", [
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
