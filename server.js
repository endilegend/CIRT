const express = require("express");
const { Pool } = require("pg");
const path = require("path");
const multer = require("multer");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// PostgreSQL Database Connection (from your Render database)
const db = new Pool({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  port: process.env.PG_PORT,
  ssl: { rejectUnauthorized: false },
});

// Verify database connection
db.connect()
  .then(() => console.log("✅ Connected to PostgreSQL Database on Render!"))
  .catch((err) => console.error("❌ Database connection failed:", err));

// ✅ 1. Register User Endpoint (unchanged except for duplicate check)
app.post("/register-user", async (req, res) => {
  console.log("Incoming Registration Request:", req.body);

  const { uid, email, fName, lName } = req.body;
  const role = "Author"; // Default Role

  if (!uid || !email || !fName || !lName) {
    console.error("❌ Missing required fields:", req.body);
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const userExists = await db.query("SELECT id FROM users WHERE id = $1", [
      uid,
    ]);
    if (userExists.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "User with this ID already exists!" });
    }

    const sql =
      "INSERT INTO users (id, f_name, l_name, email, user_role) VALUES ($1, $2, $3, $4, $5)";
    await db.query(sql, [uid, fName, lName, email, role]);

    console.log("✅ User registered in PostgreSQL:", uid);
    res
      .status(201)
      .json({ message: "✅ User registered in PostgreSQL successfully!" });
  } catch (err) {
    console.error("❌ Database Insert Error:", err.message, err.stack);
    res.status(500).json({ error: err.message });
  }
});

// ✅ 2. Test Database Connection Endpoint
app.get("/test-db", async (req, res) => {
  try {
    const result = await db.query("SELECT 1 + 1 AS result");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Database query failed:", err);
    res.status(500).send("Database error.");
  }
});

// ✅ 3. File Upload Setup Using Multer (using memory storage for BYTEA)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ 4. File Upload Endpoint with Keywords Handling
app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("❌ No file uploaded.");
  }

  const pdfBuffer = req.file.buffer;
  const authorId = req.body.author_id || null;
  const type = req.body.type || "Article";
  const status = "Sent"; // Automatically set as "Sent"
  const keywordsStr = req.body.keywords || ""; // comma-separated keywords

  try {
    // Insert the article and return its id
    const insertArticleQuery = `
      INSERT INTO article (pdf_file, author_id, status, type)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `;
    const articleResult = await db.query(insertArticleQuery, [
      pdfBuffer,
      authorId,
      status,
      type,
    ]);
    const articleId = articleResult.rows[0].id;
    console.log("✅ Article inserted with id:", articleId);

    // If keywords were provided, split by comma and insert each one
    if (keywordsStr.trim().length > 0) {
      // Split keywords by comma and trim whitespace
      const keywordsArr = keywordsStr
        .split(",")
        .map((kw) => kw.trim())
        .filter((kw) => kw !== "");
      for (const keyword of keywordsArr) {
        const insertKeywordQuery = `
          INSERT INTO keywords (article_id, keyword)
          VALUES ($1, $2)
        `;
        await db.query(insertKeywordQuery, [articleId, keyword]);
      }
      console.log("✅ Keywords inserted:", keywordsArr);
    }

    res.json({
      message: "✅ File and keywords uploaded successfully",
      articleId,
    });
  } catch (err) {
    console.error("❌ Database Insertion Error:", err);
    res.status(500).send("Database error.");
  }
});

// ✅ 5. Fetch All Articles Endpoint
app.get("/articles", async (req, res) => {
  try {
    const results = await db.query("SELECT * FROM article");
    res.json(results.rows);
  } catch (err) {
    console.error("❌ Database Query Error:", err);
    res.status(500).send("Database error.");
  }
});

// ✅ 6. Fetch a Specific Article by ID Endpoint
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

// ✅ 7. Start the Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT} (Render)`);
});
