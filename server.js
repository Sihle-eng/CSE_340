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
const { checkJWTToken } = require("./models/middleware/authMiddleware")
const orderRoute = require("./routes/orderRouter")

/* ***********************
 * View Engine
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Middleware
 *************************/
// Body parsers
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Cookie parser
app.use(cookieParser())

// Session
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

// Flash messages
app.use(require('connect-flash')())

// Make flash messages available to all views
app.use(function (req, res, next) {
  res.locals.messages = function() {
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

// JWT check (sets res.locals.loggedIn and res.locals.accountData)
app.use(checkJWTToken)

// Guard middleware: ensure defaults and fallback to session if needed
app.use((req, res, next) => {
  if (typeof res.locals.loggedIn === "undefined") {
    res.locals.loggedIn = false
  }
  if (!res.locals.accountData && req.session.accountData) {
    res.locals.accountData = req.session.accountData
    res.locals.loggedIn = true
  }
  next()
})

/* ***********************
 * Routes
 *************************/
app.use(static)
app.use("/order", orderRoute)

// Index route
app.get("/", baseController.buildHome)

// Inventory by classification route
app.use("/inv", inventoryRoute)

// Error trigger route
app.use("/error", errorRoute)

// Account route
app.use("/account", accountRoute)

// File Not Found Route
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************
 * Express Error Handler
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
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Start Server
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
