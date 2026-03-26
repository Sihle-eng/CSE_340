//required resources
const utilities = require("../utilities")
const accModel = require("../models/account-model")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Process account registration (stub)
* *************************************** */
async function registerAccount(req, res) {
    // Registration logic goes here
    res.send("Account registration not yet implemented.")
}

/* ****************************************
*  Process account login (stub)
* *************************************** */
async function loginAccount(req, res) {
    // Login logic goes here
    res.send("Account login not yet implemented.")
}

async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    const regResult = await accModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you\'re registered ${account_firstname}. Please log in`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(500).render("account/register", {
            title: "Registration",
            nav,
        })
    }
}
    
/* ****************************************
*  Deliver 'My Account' view (stub)
* *************************************** */
async function buildAccount(req, res) {
    let nav = await utilities.getNav()
    res.render("account/account", {
        title: "My Account",
        nav,
    })
}

module.exports = { buildLogin, buildRegister, registerAccount, loginAccount, buildAccount }
