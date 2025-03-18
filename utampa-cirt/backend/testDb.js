const db = require("db"); // Import the database connection

db.query("SELECT 1 + 1 AS solution", (err, results) => {
  if (err) {
    console.error("Query failed: " + err.stack);
  } else {
    console.log("Test Query Result:", results[0].solution); // Should print 2
  }
  db.end(); // Close the connection after the query
});
