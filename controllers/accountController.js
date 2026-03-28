//required resources
const utilities = require("../utilities")
const accModel = require("../models/account-model")
const bcrypt = require("bcryptjs")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
        email: '',
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

    // Hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }

    const regResult = await accModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you\'re registered ${account_firstname}. Please log in`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            email: account_email,
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
            account_firstname,
            account_lastname,
            account_email,
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
