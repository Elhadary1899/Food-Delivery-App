require("dotenv").config();
require("./src/jobs/trackingJob");

const express = require("express");
const cors = require("cors");

const authRoutes = require("./src/routes/authRoutes");
const homeRoutes = require("./src/routes/homeRoutes");
const menuRoutes = require("./src/routes/menuRoutes");
const reviewRoutes = require("./src/routes/reviewRoutes");
const itemRoutes = require("./src/routes/itemRoutes");
const cartRoutes = require("./src/routes/cartRoutes");
const profileRoutes = require("./src/routes/profileRoutes");
const checkoutRoutes = require("./src/routes/checkoutRoutes");
const trackingRoutes = require("./src/routes/trackingRoutes");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/tracking", trackingRoutes);

// ROOT TEST ROUTE
app.get("/", (req, res) => {
    res.send("Food Delivery API is running...");
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});