import express from "express";
import pool from "../db.js";
import authMiddleware from "../middleware/auth.js";
import isAdmin from "../middleware/isAdmin.js";

const router = express.Router();

// Get all users (admin only)
router.get("/users", authMiddleware, isAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, address, role FROM users"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Get dashboard stats
router.get("/stats", authMiddleware, isAdmin, async (req, res) => {
  try {
    const [[userCount]] = await pool.query(
      "SELECT COUNT(*) AS totalUsers FROM users"
    );
    const [[storeCount]] = await pool.query(
      "SELECT COUNT(*) AS totalStores FROM stores"
    );
    const [[ratingCount]] = await pool.query(
      "SELECT COUNT(*) AS totalRatings FROM ratings"
    );

    res.json({
      totalUsers: userCount.totalUsers,
      totalStores: storeCount.totalStores,
      totalRatings: ratingCount.totalRatings,
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// Get all stores (admin)
router.get("/stores", authMiddleware, isAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        s.id, 
        s.name, 
        s.address, 
        IFNULL(ROUND(AVG(r.rating), 1), 0) AS avgRating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY s.id, s.name, s.address
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching stores:", err);
    res.status(500).json({ error: "Failed to fetch stores" });
  }
});

// Add new user (admin)
router.post("/add-user", authMiddleware, isAdmin, async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, password, address || "", role]
    );
    res.json({ id: result.insertId, message: "User added successfully" });
  } catch (err) {
    console.error("Error adding user:", err);
    res.status(500).json({ error: "Failed to add user" });
  }
});

// Add new store (admin)
// router.post("/add-store", authMiddleware, isAdmin, async (req, res) => {
//   try {
//     const { name, address } = req.body;
//     if (!name || !address) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     const [result] = await pool.query(
//       "INSERT INTO stores (name, address) VALUES (?, ?)",
//       [name, address]
//     );
//     res.json({ id: result.insertId, message: "Store added successfully" });
//   } catch (err) {
//     console.error("Error adding store:", err);
//     res.status(500).json({ error: "Failed to add store" });
//   }
// });

// Create a new store
router.post("/stores", authMiddleware, isAdmin, async (req, res) => {
  try {
    const { name, owner_id, email, address } = req.body;

    if (!name || !owner_id || !email || !address) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const [result] = await pool.query(
      "INSERT INTO stores (name, owner_id, email, address) VALUES (?, ?, ?, ?)",
      [name, owner_id, email, address]
    );

    res.status(201).json({ message: "Store created", storeId: result.insertId });
  } catch (err) {
    console.error("Error creating store:", err);
    res.status(500).json({ error: "Failed to create store" });
  }
});


export default router;
