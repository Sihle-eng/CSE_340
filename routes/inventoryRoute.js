
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")

// Route to show add-inventory form
router.get("/add-inventory", invController.buildAddInventory);
// Route to handle add-inventory form submission
router.post("/add-inventory", invController.addInventory);
// Route to show add-classification form
router.get("/add-classification", invController.buildAddClassification);
// Route to handle add-classification form submission
router.post("/add-classification", invController.addClassification);
//Route to show vehicle details
router.get("/details/:invId", invController.buildVehicleDetails);
// Support /detail/:invId as well (no 's')
router.get("/detail/:invId", invController.buildVehicleDetails);
// Route to build the inventory by classification view
router.get("/type/:classification_id", invController.buildByClassification);
// Route to build the inventory management view
router.get("/", invController.buildManagement);

module.exports = router