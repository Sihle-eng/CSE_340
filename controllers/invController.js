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

module.exports = invCont;
