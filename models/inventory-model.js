const pool = require('../database');

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
    return await pool.query('SELECT * FROM public.classification ORDER BY classification_name ASC');
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i
            JOIN public.classification AS c
            ON i.classification_id = c.classification_id
            WHERE i.classification_id = $1`,
            [classification_id]
        )
        return data.rows
    } catch (error) {
        console.error('getclassificationbyid error: ' + error)
    }
}

/* ***************************
 *  Get vehicle details by ID
 * ************************** */
async function getVehicleById(invId) {
    try {
        const result = await pool.query(
            `SELECT * FROM public.inventory AS i
            JOIN public.classification AS c
            ON i.classification_id = c.classification_id
            WHERE i.inv_id = $1`,
            [invId]
        )
        return result.rows[0]
    } catch (error) {
        console.error('getvehiclebyid error: ' + error)
        throw error
    }
}

module.exports = {getClassifications, getInventoryByClassificationId, getVehicleById}























// Removed duplicate export to ensure all functions are exported above