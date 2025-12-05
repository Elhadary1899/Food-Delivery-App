const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const { protect, authorize } = require("../middleware/auth");

// All routes require authentication
router.use(protect);

// Orders
router.get("/orders", profileController.getUserOrders);

// Addresses
router.get("/addresses", profileController.getUserAddresses);
router.post("/addresses", profileController.addUserAddress);
router.put("/addresses/:addressId", profileController.updateUserAddress);
router.delete("/addresses/:addressId", profileController.deleteUserAddress);

// Account details
router.get("/account", profileController.getUserAccountDetails);
router.post("/account", profileController.updateUserAccountDetails);

// Coupons
router.get("/coupons", profileController.getUserCoupons);

// Payments
router.get("/payments", profileController.getUserPayments);
router.post("/payments", profileController.addPaymentMethod);
router.delete("/payments/:paymentId", profileController.deletePaymentMethod);

module.exports = router;