const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");

const SECRET = "your_jwt_secret";

// GET /users/me
router.get("/me", async (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Malformed token" });

  try {
    const decoded = jwt.verify(token, SECRET);

    // Use async/await with promise pool
    const [results] = await db.query(
      "SELECT id, username, email, profile_pic FROM users WHERE id = ?",
      [decoded.id]
    );

    if (results.length === 0) return res.status(404).json({ error: "User not found" });

    const user = results[0];
    if (!user.profile_pic) user.profile_pic = null; // safe fallback

    res.json(user);
  } catch (err) {
    console.error("Error fetching /users/me:", err);

    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
