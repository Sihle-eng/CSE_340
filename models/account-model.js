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




module.exports = { registerAccount, checkExistingEmail, getAccountByEmail };