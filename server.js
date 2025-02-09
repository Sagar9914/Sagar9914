const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public")); // Serve frontend files

// MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",  // Change if your MySQL user is different
    password: "kadam123",  // Change if you set a password for MySQL
    database: "complaint_system"
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed: " + err.message);
        return;
    }
    console.log("Connected to MySQL database");
});

// Save complaint to MySQL
app.post("/submit-complaint", (req, res) => {
    const { firstname, lastname, number, email, city, message } = req.body;
    const sql = "INSERT INTO complaints (firstname, lastname, number, email, city, message) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [firstname, lastname, number, email, city, message], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json({ message: "Complaint submitted successfully" });
        }
    });
});

// Fetch complaints
app.get("/get-complaints", (req, res) => {
    const sql = "SELECT * FROM complaints";
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json(results);
        }
    });
});

// Delete complaint
app.delete("/delete-complaint/:id", (req, res) => {
    const sql = "DELETE FROM complaints WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json({ message: "Complaint deleted successfully" });
        }
    });
});

// Update complaint status
app.put("/update-status/:id", (req, res) => {
    const { status } = req.body;
    const sql = "UPDATE complaints SET status = ? WHERE id = ?";
    db.query(sql, [status, req.params.id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json({ message: "Status updated successfully" });
        }
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
