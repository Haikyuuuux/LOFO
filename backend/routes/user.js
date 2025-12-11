require('dotenv').config();

const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

const SECRET = process.env.JWT_SECRET || "your_jwt_secret_key_change_this_in_production";

// Configure multer for profile picture uploads
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, `profile_${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    console.error("No authorization header");
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    console.error("Malformed token");
    return res.status(401).json({ error: "Malformed token" });
  }

  if (!SECRET) {
    console.error("JWT_SECRET is not configured");
    return res.status(500).json({ error: "Server configuration error" });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error("Token verification error:", err.name, err.message);
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    return res.status(500).json({ error: "Token verification failed" });
  }
};

// GET /users/me
router.get("/me", verifyToken, async (req, res) => {
  try {
    const [results] = await db.execute(
      "SELECT id, username, email, profile_pic, contact_number FROM users WHERE id = ?",
      [req.userId]
    );

    if (results.length === 0) return res.status(404).json({ error: "User not found" });

    const user = results[0];
    if (!user.profile_pic) user.profile_pic = null;

    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching /users/me:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// PUT /users/me - Update user profile
router.put("/me", verifyToken, upload.single("profile_pic"), async (req, res) => {
  try {
    const { username, email, contact_number } = req.body;
    const profilePic = req.file ? `/uploads/${req.file.filename}` : null;

    // Validate input
    if (!username || !email) {
      return res.status(400).json({ error: "Username and email are required" });
    }

    // Validate contact number format (optional but if provided, should be valid)
    if (contact_number && contact_number.trim() !== "") {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(contact_number)) {
        return res.status(400).json({ error: "Invalid contact number format" });
      }
    }

    // Check if username or email already exists (excluding current user)
    const [existingUsers] = await db.execute(
      "SELECT id FROM users WHERE (username = ? OR email = ?) AND id != ?",
      [username, email, req.userId]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: "Username or email already taken" });
    }

    // Update user
    const contactNum = contact_number && contact_number.trim() !== "" ? contact_number.trim() : null;
    
    if (profilePic) {
      const [results] = await db.execute(
        "UPDATE users SET username = ?, email = ?, profile_pic = ?, contact_number = ? WHERE id = ?",
        [username, email, profilePic, contactNum, req.userId]
      );
    } else {
      const [results] = await db.execute(
        "UPDATE users SET username = ?, email = ?, contact_number = ? WHERE id = ?",
        [username, email, contactNum, req.userId]
      );
    }

    // Fetch updated user
    const [updatedUser] = await db.execute(
      "SELECT id, username, email, profile_pic, contact_number FROM users WHERE id = ?",
      [req.userId]
    );

    if (updatedUser.length === 0) {
      return res.status(404).json({ error: "User not found after update" });
    }

    const user = updatedUser[0];
    if (!user.profile_pic) user.profile_pic = null;

    res.status(200).json(user);
  } catch (err) {
    console.error("Error updating /users/me:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

module.exports = router;
