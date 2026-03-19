const invModel = require('../models/inventory-model')
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
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
    let grid
    if (data.length > 0) {
        grid = '<div id="inv-display">'
        data.forEach(vehicle => {
            grid += '<li>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id 
                + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + ' details"><img src="' + vehicle.inv_thumbnail
                + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model 
                + ' on CSE Motors"></a>'
            grid += '<div class="namePrice">'
            grid += '<hr>'
            grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View ' 
                + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
                + vehicle.inv_make
                 + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span>$' 
                + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
    } else {
        grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

// /* **************************************
// * Build the vehicle details view HTML
// * ************************************ */
// Util.buildVehicleDetails = async function (vehicleData) {
//     const price = new Intl.NumberFormat('en-US').format(vehicleData.inv_price);

//     return `
//     <section class="vehicle-detail">
//         <div class="vehicle-image">
//             <img src="${vehicleData.inv_image}" alt="Image of ${vehicleData.inv_make} ${vehicleData.inv_model} on CSE Motors">
//             </div>
//             <div class="vehicle-info">
//                 <h2>${vehicleData.inv_make} ${vehicleData.inv_model}</h2>
//                 <p><strong>Price:</strong> $${price}</p>
//                 <p><strong>Mileage:</strong> ${vehicleData.inv_miles.toLocaleString()} miles</p>
//                 <p><strong>Description:</strong> ${vehicleData.inv_description}</p>
//                 <p><strong>Color:</strong> ${vehicleData.inv_color}</p>
//                 <p><strong>Classification:</strong> ${vehicleData.classification_name}</p>
//                 </div>
//             </section>
//             `;
// }
























module.exports = Util

