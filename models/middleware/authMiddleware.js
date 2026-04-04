const jwt = require("jsonwebtoken");

/* ***************************
 * Check JWT and set locals
 * ************************** */
function checkJWTToken(req, res, next) {
  const token = req.cookies.jwt;
  if (!token) {
    res.locals.loggedIn = false;
    return next();
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    res.locals.loggedIn = true;
    res.locals.accountData = decoded;
    next();
  } catch (err) {
    res.locals.loggedIn = false;
    next();
  }
}

/* ***************************
 * Restrict access to Employee/Admin
 * ************************** */
function checkAccountType(req, res, next) {
  const type = res.locals.accountData?.account_type;
  if (type === "Employee" || type === "Admin") {
    return next();
  }
  req.flash("error", "You must be logged in as Employee or Admin.");
  res.redirect("/account/login");
}

module.exports = { checkJWTToken, checkAccountType };
