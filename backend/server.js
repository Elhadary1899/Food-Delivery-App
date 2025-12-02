require("dotenv").config();
const express = require("express");
const cors = require("cors");

const menuRoutes = require("./src/routes/menuRoutes");
const reviewRoutes = require("./src/routes/reviewRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/restaurants", menuRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/", (req, res) => {
    res.send("Food Delivery API is running...");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const itemRoutes = require("./src/routes/itemRoutes");
app.use("/api/items", itemRoutes);