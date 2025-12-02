const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");

// Get item details + reviews + suggestions
router.get("/:id", itemController.getItemDetails);

module.exports = router;