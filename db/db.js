const mysql = require('mysql');
const bcrypt = require('bcrypt');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'smartstock_db'
});

function query(sql, values) {
    return new Promise((resolve, reject) => {
        pool.query(sql, values, (err, results, fields) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
}

async function getUserByEmail(email) {
    const sql = 'SELECT email, password FROM users WHERE email = ?';
    const rows = await query(sql, [email]);
    return rows.length ? rows[0] : null;
}

async function createUser(username, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    await query(sql, [username, email, hashedPassword]);
}

module.exports = { getUserByEmail, createUser };
