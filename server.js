/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities")
const session = require("express-session")
const pool = require('./database')
const errorRoute = require("./routes/errorRoute")
const accountRoute = require("./routes/accountRoute")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const { checkJWTToken } = require("./models/middleware/authMiddleware");


app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")


/* ***********************
 * Middleware
 * ************************/
// Body parsers (these don't depend on anything)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Cookie parser (needed before session and JWT)
app.use(cookieParser())

// Session (needs cookie parser)
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// 4. Flash messages (needs session)
app.use(require('connect-flash')())

// Make flash messages available to all views
app.use(function (req, res, next) {
    // Create messages function for templates
    res.locals.messages = function() {
        // Return HTML for flash messages
        let html = ''
        const types = ['success', 'error', 'notice', 'info']
        types.forEach(type => {
            const messages = req.flash(type)
            if (messages && messages.length) {
                messages.forEach(message => {
                    html += `<div class="${type}">${message}</div>`
                })
            }
        })
        return html
    }
    next()
})
// JWT Check (needs cookie parser to read the JWT cookie)
app.use(utilities.checkJWTToken)


app.use(checkJWTToken);










/* ***********************
 * View Engine aand Templates
 *************************/
/* ***********************
 * Routes
 *************************/
app.use(static)

// Index route
app.get("/", baseController.buildHome)
// Inventory by classification route
app.use("/inv", inventoryRoute)

// Error trigger route
app.use("/error", errorRoute)
// Account route (must be before 404 handler)
app.use("/account", accountRoute)
// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message: err.message,
    nav
  })
})


/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})