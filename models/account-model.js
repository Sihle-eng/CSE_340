const pool = require('../database');

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
    try {
        const sql = `
            INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
            VALUES ($1, $2, $3, $4)
            RETURNING *`;
        const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_password]);
        return result.rows[0];
    } catch (error) {
        console.error("Registration error:", error);
        return null;
    }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email) {
    try {
        const sql = "SELECT * FROM account WHERE account_email = $1";
        const email = await pool.query(sql, [account_email]);
        return email.rowCount; // Fixed: added semicolon
    } catch (error) {
        return error.message; // Fixed: added semicolon
    }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail(account_email) {
    try {
        console.log("Searching for email:", account_email) 
        
        const result = await pool.query(
            "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1",
            [account_email]
        )
        
        console.log("Query result rowCount:", result.rowCount) 
        console.log("Query result rows:", result.rows) 
        
        if (result.rows.length === 0) {
            console.log("No matching email found in database")
            return null // Explicitly return null if not found
        }
        
        return result.rows[0];
    } catch (error) {
        console.error("Database error in getAccountByEmail:", error);
        throw error;
    }
}

/* Get account by ID */
async function getAccountById(account_id) {
  const sql = "SELECT * FROM account WHERE account_id = $1";
  const data = await pool.query(sql, [account_id]);
  return data.rows[0];
}

/* Update account info */
async function updateAccount(account_id, firstname, lastname, email) {
  const sql = `
    UPDATE account
    SET account_firstname = $2,
        account_lastname = $3,
        account_email = $4
    WHERE account_id = $1
    RETURNING *;
  `;
  const data = await pool.query(sql, [account_id, firstname, lastname, email]);
  return data.rows[0];
}

/* Update account password */
async function updatePassword(account_id, hashedPassword) {
  const sql = `
    UPDATE account
    SET account_password = $2
    WHERE account_id = $1
    RETURNING *;
  `;
  const data = await pool.query(sql, [account_id, hashedPassword]);
  return data.rows[0];
}


module.exports = { registerAccount, checkExistingEmail, getAccountByEmail, getAccountById, updateAccount, updatePassword };