//required resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accController = require("../controllers/accountController")

//route to build the loign view
router.get("/login", accController.buildLogin)

//route to build the registration view
router.get("/register", accController.buildRegister)

//route to process account registration 
router.post("/register", utilities.handleErrors(accController.registerAccount))

//route to process account login
router.post("/login", utilities.handleErrors(accController.loginAccount))

//route to build the "My account" view
router.get("/", utilities.handleErrors(accController.buildAccount))

//export the router
module.exports = router