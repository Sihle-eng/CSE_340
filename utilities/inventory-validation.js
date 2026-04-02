const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}


/* **********************************
 * Check Inventory Data
 * Errors will be directed back to the add view
 * **********************************/
validate.checkInventoryData = async (req, res, next) => {
  const {
    classification_id, inv_make, inv_model, inv_year,
    inv_description, inv_image, inv_thumbnail, inv_price,
    inv_miles, inv_color
  } = req.body

  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationSelect,
      errors,
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    })
    return
  }
  next()
}



/* **********************************
 * Check Update Data
 * Errors will be directed back to the edit view
 * **********************************/
validate.checkUpdateData = async (req, res, next) => {
  const {
    inv_id, classification_id, inv_make, inv_model, inv_year,
    inv_description, inv_image, inv_thumbnail, inv_price,
    inv_miles, inv_color
  } = req.body

  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    res.render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      errors,
      inv_id,
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    })
    return
  }
  next()
}

module.exports = validate
