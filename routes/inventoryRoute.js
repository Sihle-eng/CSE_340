const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")

// Route to build the inventory by classification view
router.get("/type/:classification_id", invController.buildByClassification);

//Route to show vehicle details
router.get("/details/:invId", invController.buildVehicleDetails);

// Support /detail/:invId as well (no 's')
router.get("/detail/:invId", invController.buildVehicleDetails);

module.exports = router