require("dotenv").config();

const express = require("express");
const cors = require("cors");

const menuRoutes = require("./src/routes/menuRoutes");
const reviewRoutes = require("./src/routes/reviewRoutes");
const itemRoutes = require("./src/routes/itemRoutes");
const cartRoutes = require("./src/routes/cartRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/restaurants", menuRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/cart", cartRoutes);

// ROOT TEST ROUTE
app.get("/", (req, res) => {
    res.send("Food Delivery API is running...");
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});