const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const router = express.Router();

// Secret key for JWT
const JWT_SECRET = "your_secret_key";

// Signup route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashedPassword, address, role || "USER"]
    );

    res.json({
      message: "User registered successfully!",
      userId: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Signup failed" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (rows.length === 0)
      return res.status(400).json({ error: "User not found" });

    const user = rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

// Logout route
router.post("/logout", async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.status(400).json({ error: "No token provided" });

    // Insert into revoked tokens (blacklist)
    await pool.query("INSERT INTO revoked_tokens (token) VALUES (?)", [token]);

    res.json({ message: "Logout successful" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ error: "Logout failed" });
  }
});


const authMiddleware = require("../middleware/auth");

// Example protected route
router.get("/me", authMiddleware, async (req, res) => {
  const [rows] = await pool.query(
    "SELECT id, name, email, role FROM users WHERE id = ?",
    [req.user.id]
  );
  res.json(rows[0]);
});

// Change password (protected route)
router.post("/change-password", async (req, res) => {
  try {
    const { password } = req.body;
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(403).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query("UPDATE users SET password = ? WHERE id = ?", [
      hashedPassword,
      decoded.id,
    ]);

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Password update failed" });
  }
});


module.exports = router;
