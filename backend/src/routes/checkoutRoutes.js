const express = require("express");
const router = express.Router();
const checkoutController = require("../controllers/checkoutController");
const { protect } = require("../middleware/auth");

// 1) Get checkout summary
router.get("/", protect, checkoutController.getCheckoutSummary);

// 2) Place order
router.post("/", protect, checkoutController.placeOrder);

// 3) Get FULL order details
router.get("/:orderNumber", protect, checkoutController.getOrderFullDetails);

module.exports = router;
