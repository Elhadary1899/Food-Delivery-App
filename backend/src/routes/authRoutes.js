const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect } = require("../middleware/auth");

// Public routes (no token needed)
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/admin/login", authController.adminLogin);

// Protected routes (token required)
router.get("/me", protect, authController.getMe);

module.exports = router;