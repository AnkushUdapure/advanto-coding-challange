const express = require("express");
const pool = require("../db");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Fetch all stores with avg rating
router.get("/", authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(`
  SELECT 
      s.id, 
      s.name, 
      s.email,
      s.address, 
      IFNULL(ROUND(AVG(r.rating), 1), 0) AS rating
  FROM stores s
  LEFT JOIN ratings r ON s.id = r.store_id
  GROUP BY s.id, s.name, s.email, s.address
`);


    res.json(rows);
  } catch (err) {
    console.error("Error fetching stores:", err);
    res.status(500).json({ error: "Failed to fetch stores" });
  }
});

// Fetch single store with avg rating
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT s.id, s.name, s.address, 
             COALESCE(ROUND(AVG(r.stars), 1), 0) AS rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE s.id = ?
      GROUP BY s.id
    `,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Store not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching store:", err);
    res.status(500).json({ error: "Failed to fetch store" });
  }
});

// Create new store (Admin only)
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Access denied" });
    }

    const { name, address, rating } = req.body;
    const [result] = await pool.query(
      "INSERT INTO stores (name, address, rating) VALUES (?, ?, ?)",
      [name, address, rating || null]
    );

    res.json({
      message: "Store created successfully",
      storeId: result.insertId,
    });
  } catch (err) {
    console.error("Error creating store:", err);
    res.status(500).json({ error: "Failed to create store" });
  }
});

// Update store (Admin only)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Access denied" });
    }

    const { name, address, rating } = req.body;
    await pool.query(
      "UPDATE stores SET name = ?, address = ?, rating = ? WHERE id = ?",
      [name, address, rating, req.params.id]
    );

    res.json({ message: "Store updated successfully" });
  } catch (err) {
    console.error("Error updating store:", err);
    res.status(500).json({ error: "Failed to update store" });
  }
});

// Delete store (Admin only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    // normalize role check
    if (req.user.role.toLowerCase() !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const [result] = await pool.query("DELETE FROM stores WHERE id = ?", [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Store not found" });
    }

    res.json({ message: "Store deleted successfully" });
  } catch (err) {
    console.error("Error deleting store:", err);
    res.status(500).json({ error: "Failed to delete store" });
  }
});

// POST /stores/:id/rate
router.post("/:id/rate", authMiddleware, async (req, res) => {
  try {
    const { stars } = req.body;
    const userId = req.user.id;
    const storeId = req.params.id;

    // Validate stars
    if (!stars || stars < 1 || stars > 5) {
      return res.status(400).json({ error: "Invalid rating" });
    }

    // Insert rating into ratings table
    await pool.query(
      "INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)",
      [userId, storeId, stars]
    );

    res.json({ message: "Rating submitted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit rating" });
  }
});


// Get all stores for the logged-in owner
router.get("/owner/my-stores", authMiddleware, async (req, res) => {
  try {
    // authMiddleware should decode JWT and attach user info
    const ownerEmail = req.user.email;

    const [rows] = await pool.query(
      `
      SELECT s.id, s.name, s.address, s.owner_email,
             COALESCE(ROUND(AVG(r.stars), 1), 0) AS rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE s.owner_email = ?
      GROUP BY s.id
    `,
      [ownerEmail]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching owner stores:", err);
    res.status(500).json({ error: "Failed to fetch stores" });
  }
});


module.exports = router;
