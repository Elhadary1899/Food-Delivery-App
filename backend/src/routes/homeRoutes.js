const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");
const { protect } = require("../middleware/auth");

// Protected routes - require login
router.get("/categories", protect, homeController.getCategories);
router.get("/restaurants", protect, homeController.getRestaurants);
router.get("/popular-dishes", protect, homeController.getPopularDishes);

module.exports = router;