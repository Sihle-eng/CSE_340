//required resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")

//route to build the login view // Fixed: corrected spelling from "loign" to "login"
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
  utilities.handleErrors(accController.accountLogin)
)

//route to build the "My account" view
router.get("/", utilities.checkJWTToken, utilities.handleErrors(accController.buildAccount))

router.get("/", accController.buildManagement);

router.get("/logout", accController.logout);

router.get("/update/:account_id", accController.buildUpdateView);

router.post("/update", accController.updateAccountInfo);

router.post("/update-password", accController.updatePassword);



//export the router
module.exports = router