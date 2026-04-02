const Util = {}
const jwt = require("jsonwebtoken")
const invModel = require('../models/inventory-model') // Moved to the top
require("dotenv").config()

Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
        '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
        classificationList += '<option value="' + row.classification_id + '"'
        if (
            classification_id != null &&
            row.classification_id == classification_id
        ) {
            classificationList += " selected "
        }
        classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
}

// Async error handler for Express routes
Util.handleErrors = function (fn) {
    return function (req, res, next) {
        Promise.resolve(fn(req, res, next)).catch(next)
    }
}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function () { // Fixed: removed unused req, res, next parameters
    let data = await invModel.getClassifications()
    let list = '<ul>'
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list += 
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
} 

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function (data) {
    let grid;
    if (!Array.isArray(data) || data.length === 0) {
        grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
        return grid;
    }
    grid = '<ul id="inv-display">'; // Fixed: changed from div to ul to match closing tag
    data.forEach(vehicle => {
        grid += '<li>';
        grid += '<a href="../../inv/detail/' + vehicle.inv_id 
            + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
            + ' details"><img src="' + vehicle.inv_thumbnail
            + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model 
            + ' on CSE Motors"></a>';
        grid += '<div class="namePrice">';
        grid += '<hr>';
        grid += '<h2>';
        grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View ' 
            + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
            + vehicle.inv_make
            + ' ' + vehicle.inv_model + '</a>';
        grid += '</h2>';
        grid += '<span>$' 
            + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>';
        grid += '</div>';
        grid += '</li>';
    });
    grid += '</ul>';
    return grid;
}
 
/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
    console.log("Checking JWT token...")
    console.log("Cookies:", req.cookies)
    
    if (req.cookies.jwt) {
        console.log("JWT cookie found, verifying...")
        jwt.verify(
            req.cookies.jwt,
            process.env.ACCESS_TOKEN_SECRET,
            function (err, accountData) {
                if (err) {
                    console.error("JWT verification failed:", err.message)
                    // Don't redirect here - just clear the cookie and continue
                    res.clearCookie("jwt")
                    res.locals.accountData = null
                    res.locals.loggedin = 0
                    // Don't use req.flash here as it might cause issues
                    next()
                } else {
                    console.log("JWT verified successfully for:", accountData.account_email)
                    res.locals.accountData = accountData
                    res.locals.loggedin = 1
                    next()
                }
            })
    } else {
        console.log("No JWT cookie found")
        res.locals.accountData = null
        res.locals.loggedin = 0
        next()
    }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
    if (!res.locals.loggedin) {
        next()
    } else {
        res.flash("notice", "Please log in.")
        res.redirect("/account/login")
    }
}



module.exports = Util