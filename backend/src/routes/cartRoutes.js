const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

// Add item to cart
router.post("/add", cartController.addToCart);

// Get user's cart
router.get("/:userId", cartController.getCartItems);

module.exports = router;