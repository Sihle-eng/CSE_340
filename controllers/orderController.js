const orderModel = require("../models/order-model");
const inventoryModel = require("../models/inventory-model"); 
const utilities = require("../utilities");

/* ***********************
 * Build Order Page
 *************************/
async function buildOrderPage(req, res) {
  let nav = await utilities.getNav();
  const { car_id } = req.params; // DB column is car_id

  try {
    const vehicle = await inventoryModel.getCarById(car_id);

    // Format price
    vehicle.priceFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
      .format(vehicle.inv_price);

    // Format mileage
    vehicle.mileageFormatted = new Intl.NumberFormat('en-US').format(vehicle.inv_miles);

    res.render("order/order", {
      title: "Confirm Purchase",
      nav,
      vehicle,   
      errors: null,
      loggedIn: res.locals.loggedIn,
      accountData: res.locals.accountData,
      messages: req.flash()
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "Unable to load vehicle details.");
    res.redirect("/account");
  }
}

/* ***********************
 * Process Order
 *************************/
async function processOrder(req, res) {
  let nav = await utilities.getNav();
  const { car_id, total, payment_method } = req.body;

  // ✅ Guard against missing accountData
  if (!res.locals.accountData) {
    req.flash("error", "You must be logged in to place an order.");
    return res.redirect("/account/login");
  }

  const account_id = res.locals.accountData.account_id;

  try {
    await orderModel.createOrder(account_id, car_id, total, payment_method);
    req.flash("notice", "Order placed successfully. Invoice will be sent to your email.");
    res.redirect("/account/");
  } catch (error) {
    console.error(error);
    req.flash("error", "Order failed. Please try again.");

    // Fetch vehicle again so EJS has data
    const vehicle = await inventoryModel.getCarById(car_id);

    // Format again for consistency
    vehicle.priceFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
      .format(vehicle.inv_price);
    vehicle.mileageFormatted = new Intl.NumberFormat('en-US').format(vehicle.inv_miles);

    res.status(500).render("order/order", {
      title: "Confirm Purchase",
      nav,
      vehicle,  
      total,
      payment_method,
      errors: null,
      loggedIn: res.locals.loggedIn,
      accountData: res.locals.accountData,
      messages: req.flash()
    });
  }
}

module.exports = { buildOrderPage, processOrder };
