const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const utilities = require("../utilities");

router.get("/:car_id", orderController.buildOrderPage);

// Process order confirmation
router.post("/confirm", utilities.checkJWTToken, orderController.processOrder);

module.exports = router;