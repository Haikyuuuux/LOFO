const express = require("express");
const cors = require("cors");
const path = require("path");

const itemsRoute = require("./routes/items");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/items", itemsRoute);
app.use("/auth", authRoute);
app.use("/users", userRoute);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
