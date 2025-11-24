const express = require("express");
const router = express.Router();
const itemsController = require("../controllers/itemsController");
const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });


router.get("/", itemsController.getItems);
router.post("/", upload.single("image"), itemsController.addItem);

module.exports = router;
