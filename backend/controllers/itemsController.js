const db = require("../db");

exports.getItems = (req, res) => {
  const filter = req.query.type;
  let sql = "SELECT * FROM items ORDER BY id DESC";

  if (filter === "lost" || filter === "found") {
    sql = "SELECT * FROM items WHERE type = ? ORDER BY id DESC";
    db.query(sql, [filter], (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    });
  } else {
    db.query(sql, (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    });
  }
};

exports.addItem = (req, res) => {
  const { name, description, location, type, user_id } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  const sql =
    "INSERT INTO items (name, description, location, type, image_url, user_id) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(sql, [name, description, location, type, image, user_id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Item added successfully" });
  });
};
