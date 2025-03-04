const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("./db");

const app = express();
const PORT = 3000;

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Uploads directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});
const upload = multer({ storage });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads")); // Serve static files

// File Upload Route
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const { filename, path: filepath } = req.file;

  db.query(
    "INSERT INTO files (filename, filepath) VALUES (?, ?)",
    [filename, filepath],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json({
        message: "File uploaded successfully!",
        fileId: result.insertId,
      });
    }
  );
});

// Get All Uploaded Files
app.get("/files", (req, res) => {
  db.query("SELECT * FROM files", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get a Specific File by ID
app.get("/files/:id", (req, res) => {
  const fileId = req.params.id;

  db.query("SELECT * FROM files WHERE id = ?", [fileId], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ error: "File not found" });
    }
    res.sendFile(path.resolve(__dirname, results[0].filepath));
  });
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
