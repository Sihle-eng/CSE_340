//required resources
const utilities = require("../utilities")
const accModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

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
*  Process account registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    // Hash the password before storing
    let hashedPassword
    try {
        hashedPassword = await bcrypt.hash(account_password, 10)
    } catch (error) {
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
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            email: account_email,
        })
    } else {
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
*  Deliver 'My Account' view
* *************************************** */
async function buildAccount(req, res) {
    try {
        let nav = await utilities.getNav()
        
        // Check if user is logged in
        if (!res.locals.accountData) {
            return res.redirect("/account/login")
        }
        
        res.render("account/account", {
            title: "My Account",
            nav,
            accountData: res.locals.accountData,
            loggedin: true
        })
    } catch (error) {
        console.error("Error in buildAccount:", error)
        res.redirect("/account/login")
    }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
    console.log("=== ACCOUNT LOGIN FUNCTION CALLED ===")
    console.log("Request body:", req.body)
    
    let nav = await utilities.getNav()
    let { account_email, account_password } = req.body
    
    // Normalize email
    account_email = account_email.toLowerCase().trim()
    
    try {
        const accountData = await accModel.getAccountByEmail(account_email)
        
        if (!accountData) {
            console.log("No account found for email:", account_email)
            return res.status(401).render("account/login", {
                title: "Login",
                nav,
                errors: [{ msg: "Please check your credentials and try again." }],
                account_email,
            })
        }
        
        const isMatch = await bcrypt.compare(account_password, accountData.account_password)
        
        if (isMatch) {
            console.log("Login successful for:", account_email)
            
            // Remove password before creating token
            delete accountData.account_password
            
            const accessToken = jwt.sign(
                accountData, 
                process.env.ACCESS_TOKEN_SECRET, 
                { expiresIn: "1h" }
            )
            
            // Set cookie
            res.cookie("jwt", accessToken, {
                httpOnly: true,
                maxAge: 3600000,
                path: '/',
                sameSite: 'lax'
            })
            
            console.log("Login successful, redirecting to /account/")
            return res.redirect("/account/")
        } else {
            console.log("Password mismatch for email:", account_email)
            return res.status(401).render("account/login", {
                title: "Login",
                nav,
                errors: [{ msg: "Please check your credentials and try again." }],
                account_email,
            })
        }
    } catch (error) {
        console.error("Login error:", error)
        return res.status(500).render("account/login", {
            title: "Login",
            nav,
            errors: [{ msg: "An error occurred during login. Please try again." }],
            account_email,
        })
    }
}

module.exports = { buildLogin, buildRegister, registerAccount, buildAccount, accountLogin }