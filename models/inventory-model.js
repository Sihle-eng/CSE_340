/* ***************************
 *  Add a new inventory item
 * ************************** */
async function addInventory({
    classification_id, inv_make, inv_model, inv_year, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
}) {
    try {
        const sql = `INSERT INTO public.inventory
            (classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;
        return await pool.query(sql, [
            classification_id, inv_make, inv_model, inv_year, inv_description,
            inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
        ]);
    } catch (error) {
        throw error;
    }
}
/* ***************************
 *  Add a new classification
 * ************************** */
async function addClassification(classification_name) {
    try {
        const sql = 'INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *';
        return await pool.query(sql, [classification_name]);
    } catch (error) {
        throw error;
    }
}

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

async function updateInventory(
  inv_id, inv_make, inv_model, inv_description, inv_image,
  inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id
) {
  try {
    const sql = `
      UPDATE inventory
      SET inv_make = $2, inv_model = $3, inv_description = $4,
          inv_image = $5, inv_thumbnail = $6, inv_price = $7,
          inv_year = $8, inv_miles = $9, inv_color = $10,
          classification_id = $11
      WHERE inv_id = $1
      RETURNING *`
    const data = await pool.query(sql, [
      inv_id, inv_make, inv_model, inv_description, inv_image,
      inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id
    ])
    return data.rows[0]
  } catch (error) {
    throw error
  }
}


/* ***************************
 *  Delete Inventory Item
 * ************************** */
async function deleteInventoryItem(inv_id) {
  try {
    const sql = "DELETE FROM inventory WHERE inv_id = $1";
    const data = await pool.query(sql, [inv_id]);
    return data;
  } catch (error) {
    throw new Error("Delete Inventory Error");
  }
}

// get car details by id
async function getCarById(car_id) {
    const sql = "SELECT * FROM inventory WHERE inv_id = $1";
    const result = await pool.query(sql, [car_id]);
    return result.rows[0];
}

module.exports = {getClassifications, getInventoryByClassificationId, getVehicleById, addClassification, addInventory, updateInventory, deleteInventoryItem, getCarById}























// Removed duplicate export to ensure all functions are exported above