const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");

router.get("/restaurants", homeController.getRestaurants);
router.get("/popular-dishes", homeController.getPopularDishes);

module.exports = router;