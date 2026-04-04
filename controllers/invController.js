
const invCont = {}
const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");


// Render add-inventory form
invCont.buildAddInventory = async function (req, res, next) {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList();
    res.render("inventory/add-inventory", {
        title: "Add Inventory Item",
        nav,
        classificationList,
        errors: null,
        ...req.body // sticky fields if present
    });
}

// Handle add-inventory form submission
invCont.addInventory = async function (req, res, next) {
    let nav = await utilities.getNav();
    let {
        classification_id, inv_make, inv_model, inv_year, inv_description,
        inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
    } = req.body;
    let errors = [];
    // Server-side validation
    if (!classification_id) errors.push({ msg: "Classification is required." });
    if (!inv_make) errors.push({ msg: "Make is required." });
    if (!inv_model) errors.push({ msg: "Model is required." });
    if (!inv_year || isNaN(inv_year) || inv_year < 1900 || inv_year > 2099) errors.push({ msg: "Year must be between 1900 and 2099." });
    if (!inv_description) errors.push({ msg: "Description is required." });
    if (!inv_image) errors.push({ msg: "Image path is required." });
    if (!inv_thumbnail) errors.push({ msg: "Thumbnail path is required." });
    if (!inv_price || isNaN(inv_price) || inv_price < 0) errors.push({ msg: "Price must be a positive number." });
    if (!inv_miles || isNaN(inv_miles) || inv_miles < 0) errors.push({ msg: "Miles must be a positive number." });
    if (!inv_color) errors.push({ msg: "Color is required." });
    if (errors.length > 0) {
        let classificationList = await utilities.buildClassificationList(classification_id);
        return res.render("inventory/add-inventory", {
            title: "Add Inventory Item",
            nav,
            classificationList,
            errors: { array: () => errors },
            ...req.body
        });
    }
    // Insert into DB
    try {
        const result = await invModel.addInventory({
            classification_id, inv_make, inv_model, inv_year, inv_description,
            inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
        });
        if (result && result.rowCount === 1) {
            req.flash("notice", "Inventory item added successfully!");
            return res.redirect("/inv/");
        } else {
            let classificationList = await utilities.buildClassificationList(classification_id);
            req.flash("notice", "Failed to add inventory item.");
            return res.render("inventory/add-inventory", {
                title: "Add Inventory Item",
                nav,
                classificationList,
                errors: { array: () => [{ msg: "Failed to add inventory item." }] },
                ...req.body
            });
        }
    } catch (err) {
        let classificationList = await utilities.buildClassificationList(classification_id);
        req.flash("notice", "Database error: " + err.message);
        return res.render("inventory/add-inventory", {
            title: "Add Inventory Item",
            nav,
            classificationList,
            errors: { array: () => [{ msg: "Database error: " + err.message }] },
            ...req.body
        });
    }
}


// Render add-classification form
invCont.buildAddClassification = async function (req, res, next) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null,
    });
}

// Handle add-classification form submission
invCont.addClassification = async function (req, res, next) {
    let nav = await utilities.getNav();
    const { classification_name } = req.body;
    // Server-side validation: only alphanumeric, no spaces or special chars
    const errors = [];
    if (!classification_name || !/^[A-Za-z0-9]+$/.test(classification_name)) {
        errors.push({ msg: "Classification name cannot contain spaces or special characters." });
    }
    if (errors.length > 0) {
        return res.render("inventory/add-classification", {
            title: "Add Classification",
            nav,
            errors: { array: () => errors },
        });
    }
    // Insert into DB
    try {
        const result = await invModel.addClassification(classification_name);
        if (result && result.rowCount === 1) {
            // Success: update nav and render management view with success message
            nav = await utilities.getNav();
            req.flash("notice", "Classification added successfully!");
            return res.redirect("/inv/");
        } else {
            req.flash("notice", "Failed to add classification.");
            return res.render("inventory/add-classification", {
                title: "Add Classification",
                nav,
                errors: { array: () => [{ msg: "Failed to add classification." }] },
            });
        }
    } catch (err) {
        req.flash("notice", "Database error: " + err.message);
        return res.render("inventory/add-classification", {
            title: "Add Classification",
            nav,
            errors: { array: () => [{ msg: "Database error: " + err.message }] },
        });
    }
}


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
        title: "CSE vehicles", // 
        nav,
        grid,
    });
}

/* ***************************
 *  Build vehicle details view
 * ************************** */
invCont.buildVehicleDetails = async function (req, res, next) {
    try {
        const invId = req.params.invId;
        const vehicleData = await invModel.getVehicleById(invId);

        if (!vehicleData) {
            return res.status(404).render("./errors/404", {
                title: "Vehicle Not Found",
                nav: await utilities.getNav(),
            });
        }
        
        // format price and mileage
        vehicleData.priceFormatted = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(vehicleData.inv_price);

        vehicleData.mileageFormatted = new Intl.NumberFormat('en-US').format(vehicleData.inv_miles);

        //render using same layout
        res.render("./inventory/details", {
            title: `${vehicleData.inv_make} ${vehicleData.inv_model} Details`,
            nav: await utilities.getNav(),
            vehicle: vehicleData,
        });

    } catch (error) {
        next(error);
    }
};
/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
    try {
        let nav = await utilities.getNav();
        const message = req.flash("notice");
        const classificationSelect = await utilities.buildClassificationList()
        res.render("./inventory/management", {
            title: "Inventory Management",
            nav,
            classificationSelect,
            message
        });
    } catch (error) {
        next(error);

    }
};


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  try {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)

    if (invData && invData.length > 0) {
      return res.json(invData)
    } else {
      // No rows returned
      return res.json({ message: "No inventory found for this classification." })
    }
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getVehicleById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

// Handle add-inventory form submission
invCont.updateInventory = async function (req, res, next) {
    let nav = await utilities.getNav();
    let {
        classification_id, inv_make, inv_model, inv_year, inv_description,
        inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
    } = req.body;
    let errors = [];
    // Server-side validation
    if (!classification_id) errors.push({ msg: "Classification is required." });
    if (!inv_make) errors.push({ msg: "Make is required." });
    if (!inv_model) errors.push({ msg: "Model is required." });
    if (!inv_year || isNaN(inv_year) || inv_year < 1900 || inv_year > 2099) errors.push({ msg: "Year must be between 1900 and 2099." });
    if (!inv_description) errors.push({ msg: "Description is required." });
    if (!inv_image) errors.push({ msg: "Image path is required." });
    if (!inv_thumbnail) errors.push({ msg: "Thumbnail path is required." });
    if (!inv_price || isNaN(inv_price) || inv_price < 0) errors.push({ msg: "Price must be a positive number." });
    if (!inv_miles || isNaN(inv_miles) || inv_miles < 0) errors.push({ msg: "Miles must be a positive number." });
    if (!inv_color) errors.push({ msg: "Color is required." });
    if (errors.length > 0) {
        let classificationList = await utilities.buildClassificationList(classification_id);
        return res.render("inventory/add-inventory", {
            title: "Add Inventory Item",
            nav,
            classificationList,
            errors: { array: () => errors },
            ...req.body
        });
    }
    // Insert into DB
    try {
        const result = await invModel.addInventory({
            classification_id, inv_make, inv_model, inv_year, inv_description,
            inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
        });
        if (result && result.rowCount === 1) {
            req.flash("notice", "Inventory item added successfully!");
            return res.redirect("/inv/");
        } else {
            let classificationList = await utilities.buildClassificationList(classification_id);
            req.flash("notice", "Failed to add inventory item.");
            return res.render("inventory/add-inventory", {
                title: "Add Inventory Item",
                nav,
                classificationList,
                errors: { array: () => [{ msg: "Failed to add inventory item." }] },
                ...req.body
            });
        }
    } catch (err) {
        let classificationList = await utilities.buildClassificationList(classification_id);
        req.flash("notice", "Database error: " + err.message);
        return res.render("inventory/add-inventory", {
            title: "Add Inventory Item",
            nav,
            classificationList,
            errors: { array: () => [{ msg: "Database error: " + err.message }] },
            ...req.body
        });
    }
}



/* ***************************
 *  Update inventory item
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  try {
    const {
      inv_id, classification_id, inv_make, inv_model, inv_year,
      inv_description, inv_image, inv_thumbnail, inv_price,
      inv_miles, inv_color
    } = req.body

    // Ensure inv_id is a single integer, not an array or object
    const cleanInvId = parseInt(Array.isArray(inv_id) ? inv_id[0] : inv_id)

    const result = await invModel.updateInventory(
      cleanInvId,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    )

    if (result) {
      const itemName = result.inv_make + " " + result.inv_model
      req.flash("notice", `The ${itemName} was successfully updated.`)
      return res.redirect("/inv/")
    } else {
      const classificationSelect = await utilities.buildClassificationList(classification_id)
      const itemName = `${inv_make} ${inv_model}`
      req.flash("notice", "Update failed.")
      return res.status(501).render("inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav: await utilities.getNav(),
        classificationSelect,
        errors: null,
        inv_id: cleanInvId,
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
    }
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Build Delete Confirmation View
 * ************************** */
invCont.buildDeleteConfirmation = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id);
    const nav = await utilities.getNav();
    const itemData = await invModel.getVehicleById(inv_id);

    const itemName = `${itemData.make} ${itemData.model}`;

    res.render("inventory/delete-confirm", {
      title: `Delete ${itemName}`,
      nav,
      errors: null,
      inv: itemData
    });
  } catch (error) {
    next(error);
  }
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
invCont.deleteInventoryItem = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.body.inv_id);
    const result = await invModel.deleteInventoryItem(inv_id);

    if (result.rowCount > 0) {
      req.flash("notice", "The item was successfully deleted.");
      res.redirect("/inv/");
    } else {
      req.flash("notice", "Delete failed. Please try again.");
      res.redirect(`/inv/delete/${inv_id}`);
    }
  } catch (error) {
    next(error);
  }
}



module.exports = invCont;
