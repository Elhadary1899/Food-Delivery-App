const express = require("express");
const router = express.Router();
const trackingController = require("../controllers/trackingController");
const { protect, authorize } = require("../middleware/auth");

// Admin: Get all orders
router.get("/admin/all", protect, authorize("Admin"), trackingController.getAllOrders);

// Cancel an order (must be logged in)
router.delete("/:orderId/cancel", protect, trackingController.cancelOrder);

// Get tracking status + history (must be logged in)
router.get("/:orderId", protect, trackingController.getOrderTracking);

module.exports = router;
