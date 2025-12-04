const express = require("express");
const router = express.Router();
const trackingController = require("../controllers/trackingController");

// Cancel an order
router.delete("/:orderId/cancel", trackingController.cancelOrder);

// Get tracking status + history
router.get("/:orderId", trackingController.getOrderTracking);

module.exports = router;