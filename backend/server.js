const express = require("express");
const cors = require("cors");
const path = require("path");

const itemsRoute = require("./routes/items");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");  // <-- new

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/items", itemsRoute);
app.use("/auth", authRoute);
app.use("/users", userRoute); // <-- new

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
