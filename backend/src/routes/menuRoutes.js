const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");

// GET all restaurants (with pagination)
router.get("/", menuController.getRestaurants);

// Search restaurants
router.get("/search", menuController.searchRestaurants);

// Get menu of a specific restaurant
router.get("/:id/menu", menuController.getRestaurantMenu);

// Search items
router.get("/:id/search-items", menuController.searchRestaurantItems);

module.exports = router;