const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

// Get user's cart
router.get("/:userId", cartController.getCartItems);

// Add item to cart
router.post("/add", cartController.addToCart);

// Increment item's quantity
router.put("/increment", cartController.incrementItem);

// Decrement item's quantity
router.put("/decrement", cartController.decrementItem);

// Remove item from cart
router.delete("/remove", cartController.removeItem);

module.exports = router;