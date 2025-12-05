const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { protect } = require("../middleware/auth");

// Get user's cart
router.get("/", protect, cartController.getCartItems);

// Add item to cart
router.post("/add", protect, cartController.addToCart);

// Increment item's quantity
router.put("/increment", protect, cartController.incrementItem);

// Decrement item's quantity
router.put("/decrement", protect, cartController.decrementItem);

// Remove item from cart
router.delete("/remove", protect, cartController.removeItem);

// Clear cart
router.delete("/clear", protect, cartController.clearCart);

module.exports = router;