const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");

router.get("/", menuController.getRestaurants);
router.get("/search", menuController.searchRestaurants);
router.get("/:restaurantName/menu", menuController.getRestaurantMenu);
router.get("/:restaurantName/search-items", menuController.searchRestaurantItems);

module.exports = router;