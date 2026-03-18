const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")

// Route to build the inventory by classification view
router.get("/type/:classification_id", invController.buildByClassification);

module.exports = router