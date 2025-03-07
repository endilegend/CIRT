const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("./db");

const app = express();
const PORT = 3000;

// Set up storage engine for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  },
});

const upload = multer({ storage });

// Endpoint to handle file upload
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const { filename, path } = req.file;
  const authorId = req.body.author_id || null;
  const status = "Sent";
  const type = req.body.type || "Article";

  // Save file path in database
  const sql =
    "INSERT INTO ARTICLE (PDF_PATH, AUTHOR_ID, STATUS, TYPE) VALUES (?, ?, ?, ?)";
  db.query(sql, [path, authorId, status, type], (err, result) => {
    if (err) {
      console.error("Database Insertion Error:", err);
      return res.status(500).send("Database error.");
    }
    res.send({ message: "File uploaded successfully", filePath: path });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
