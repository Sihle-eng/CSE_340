const invModel = require('../models/inventory-model')
const utilities = require('../utilities')

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassification = async function (req, res, next) {
    const classification_id = req.params.classification_id;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    // You may want to get the className from data or another source
    res.render("./inventory/classification", {
        title: "Class vehicles", // Consider updating this to use the actual class name
        nav,
        grid,
    });
}

module.exports = invCont;
