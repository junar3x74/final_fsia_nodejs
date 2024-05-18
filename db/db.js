const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'smartstock_db'
});

function query(sql, values, callback) {
    pool.query(sql, values, (err, results, fields) => {
        if (err) {
            return callback(err, null, null);
        }
        callback(null, results, fields);
    });
}

module.exports = { query };
