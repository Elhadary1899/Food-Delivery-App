const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");

// Recommendations
router.get("/:restaurantName/:itemName/recommendations", itemController.getRecommendations);

// Item page
router.get("/:restaurantName/:itemName", itemController.getItemPageData);

module.exports = router;
