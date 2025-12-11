require('dotenv').config();

const express = require("express");
const router = express.Router();
const itemsController = require("../controllers/itemsController");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "your_jwt_secret_key_change_this_in_production";

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Malformed token" });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    return res.status(500).json({ error: "Token verification failed" });
  }
};

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.get("/", itemsController.getItems);
router.post("/", upload.single("image"), itemsController.addItem);
router.delete("/:id", verifyToken, itemsController.deleteItem);

module.exports = router;
