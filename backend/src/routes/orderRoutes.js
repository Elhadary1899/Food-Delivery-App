const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { protect } = require("../middleware/auth");

// All routes require authentication
router.get("/checkout", protect, orderController.getCheckoutSummary);
router.post("/place", protect, orderController.placeOrder);
router.get("/:orderNumber", protect, orderController.getOrderByNumber);

module.exports = router;
