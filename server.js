const express = require("express");
const cors = require("cors");
const db = require("./db"); // Import the MySQL database connection

const app = express();
const PORT = 5050;

// Middleware
app.use(express.json()); // Allows JSON data in requests
app.use(cors()); // Enables Cross-Origin requests (optional)

// Root Route (Check if server is running)
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ **GET All Users (Example Query)**
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Database query error");
    } else {
      res.json(results);
    }
  });
});

// ✅ **POST: Create a New User**
app.post("/users", (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  db.query(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    [name, email],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error inserting user");
      } else {
        res.status(201).json({ id: results.insertId, name, email });
      }
    }
  );
});

// ✅ **PUT: Update a User**
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  db.query(
    "UPDATE users SET name = ?, email = ? WHERE id = ?",
    [name, email, id],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error updating user");
      } else {
        res.json({ message: "User updated successfully" });
      }
    }
  );
});

// ✅ **DELETE: Remove a User**
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM users WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error deleting user");
    } else {
      res.json({ message: "User deleted successfully" });
    }
  });
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
