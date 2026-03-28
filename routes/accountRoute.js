//required resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")

//route to build the loign view
router.get("/login", accController.buildLogin)

//route to build the registration view
router.get("/register", accController.buildRegister)

// Process the registration data
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accController.registerAccount)
)

//route to process account login with validation
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accController.loginAccount)
)

//route to build the "My account" view
router.get("/", utilities.handleErrors(accController.buildAccount))

//process login attempts
router.post(
  "/login",
  (req, res) => {
    res.status(200).send('login process')
  }
)

//export the router
module.exports = router