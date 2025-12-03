const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");

// Get user orders (delivered/completed and cancelled)
router.get("/:userId/orders", profileController.getUserOrders);

// Get user addresses
router.get("/:userId/addresses", profileController.getUserAddresses);

// Get user account details
router.get("/:userId/account", profileController.getUserAccountDetails);

// Update user account details
router.post("/:userId/account", profileController.updateUserAccountDetails);

// Get user coupons
router.get("/:userId/coupons", profileController.getUserCoupons);

// Get user payments
router.get("/:userId/payments", profileController.getUserPayments);

module.exports = router;

