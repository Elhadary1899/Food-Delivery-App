const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

// TEMP route so Express doesn't crash
router.get("/", (req, res) => {
    res.json({ message: "Reviews endpoint OK" });
});

// Add review
router.post("/", reviewController.addReview);

module.exports = router;