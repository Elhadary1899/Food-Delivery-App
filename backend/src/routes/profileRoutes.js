const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");

// Get user orders (delivered/completed and cancelled)
router.get("/:userId/orders", profileController.getUserOrders);

// Get user addresses
router.get("/:userId/addresses", profileController.getUserAddresses);

// Add user addresses
router.post("/:userId/addresses", profileController.addUserAddress);

// Edit user addresses
router.put("/:userId/addresses/:addressId", profileController.updateUserAddress);

// Delete user addresses
router.delete("/:userId/addresses/:addressId", profileController.deleteUserAddress);

// Get user account details
router.get("/:userId/account", profileController.getUserAccountDetails);

// Update user account details
router.post("/:userId/account", profileController.updateUserAccountDetails);

// Get user coupons
router.get("/:userId/coupons", profileController.getUserCoupons);

// Get user payments
router.get("/:userId/payments", profileController.getUserPayments);

// Add user payments
router.post("/:userId/payments", profileController.addPaymentMethod);

// Delete user payments
router.delete("/:userId/payments/:paymentId", profileController.deletePaymentMethod);


module.exports = router;