const pool = require('../database');

async function createOrder(account_id, car_id, total, payment_method) {
    const sql = `
    INSERT INTO orders (account_id, car_id, total, payment_method)
    VALUES ($1, $2, $3, $4)
    RETURNING *`
    const values = [account_id, car_id, total, payment_method];
    const result = await pool.query(sql, values);
    return result.rows[0];
}

async function getOrdersByAccountId(account_id) {
  const sql = `
    SELECT o.order_id, o.order_date, o.status, o.total, o.payment_method,
           v.inv_year, v.inv_make, v.inv_model, v.inv_color, v.inv_description
    FROM orders o
    JOIN inventory v ON o.car_id = v.inv_id
    WHERE o.account_id = $1
    ORDER BY o.order_date DESC
  `;
  const result = await pool.query(sql, [account_id]);
  return result.rows;
}


module.exports = { createOrder, getOrdersByAccountId };
