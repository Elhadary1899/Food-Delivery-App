const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

// Add review
router.post("/add", reviewController.addReview);

// Get reviews for item in a specific restaurant
router.get("/:restaurantName/:itemName", reviewController.getItemReviews);

module.exports = router;