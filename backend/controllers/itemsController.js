const db = require("../db");

exports.getItems = async (req, res) => {
  try {
    const filter = req.query.type;
    let results;

    if (filter === "lost" || filter === "found") {
      [results] = await db.execute(
        `SELECT i.*, u.username, u.email, u.contact_number 
         FROM items i 
         LEFT JOIN users u ON i.user_id = u.id 
         WHERE i.type = ? 
         ORDER BY i.id DESC`,
        [filter]
      );
    } else {
      [results] = await db.execute(
        `SELECT i.*, u.username, u.email, u.contact_number 
         FROM items i 
         LEFT JOIN users u ON i.user_id = u.id 
         ORDER BY i.id DESC`
      );
    }

    // Ensure all items have required fields
    const formattedResults = results.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      location: item.location,
      type: item.type,
      image_url: item.image_url || null,
      created_at: item.created_at || new Date().toISOString(),
      user_id: item.user_id,
      username: item.username || null,
      email: item.email || null,
      contact_number: item.contact_number || null,
    }));

    res.status(200).json(formattedResults);
  } catch (err) {
    console.error("Error fetching items:", err);
    res.status(500).json({ message: "Failed to fetch items", error: err.message });
  }
};

exports.addItem = async (req, res) => {
  try {
    const { name, description, location, type, user_id } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    // Validate required fields
    if (!name || !description || !location || !type || !user_id) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    // Validate type
    if (type !== "lost" && type !== "found") {
      return res.status(400).json({ message: "Type must be 'lost' or 'found'" });
    }

    // Insert item
    const [result] = await db.execute(
      "INSERT INTO items (name, description, location, type, image_url, user_id) VALUES (?, ?, ?, ?, ?, ?)",
      [name, description, location, type, image, user_id]
    );

    // Return success immediately
    res.status(200).json({ 
      message: "Item added successfully",
      id: result.insertId 
    });
  } catch (err) {
    console.error("Error adding item:", err);
    res.status(500).json({ message: "Failed to add item", error: err.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId; // Get from JWT token (set by verifyToken middleware)

    if (!id) {
      return res.status(400).json({ message: "Item ID is required" });
    }

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Check if item exists and belongs to user
    const [items] = await db.execute(
      "SELECT user_id FROM items WHERE id = ?",
      [id]
    );

    if (items.length === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Verify ownership
    if (items[0].user_id !== userId) {
      return res.status(403).json({ message: "You can only delete your own items" });
    }

    // Delete the item
    await db.execute("DELETE FROM items WHERE id = ?", [id]);

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error("Error deleting item:", err);
    res.status(500).json({ message: "Failed to delete item", error: err.message });
  }
};
