
const Util = {}

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

const invModel = require('../models/inventory-model')


// Async error handler for Express routes
Util.handleErrors = function (fn) {
    return function (req, res, next) {
        Promise.resolve(fn(req, res, next)).catch(next)
    }
}

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
            '<a href="/inventory/type/' +
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
    grid = '<div id="inv-display">';
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
 























module.exports = Util

