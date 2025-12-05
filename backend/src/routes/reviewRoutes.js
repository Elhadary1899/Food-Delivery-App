const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { protect } = require("../middleware/auth");

// Add review
router.post("/add", protect, reviewController.addReview);

// Update review
router.put("/update", protect, reviewController.updateReview);

// Delete review
router.delete("/delete", protect, reviewController.deleteReview);

// GET reviews for an item (name-based)
router.get("/:restaurantName/:itemName", reviewController.getItemReviews);

module.exports = router;