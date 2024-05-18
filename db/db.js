const mysql = require('mysql2');

// Create a MySQL connection pool
const pool = mysql.createPool({
    connectionLimit: 10, 
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'smartstock_db'
});

// Export a function to execute queries
module.exports.query = (sql, values, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            // Handle connection error
            callback(err, null);
            return;
        }
        // Use the connection
        connection.query(sql, values, (err, results, fields) => {
            // Release the connection when done
            connection.release();
            // Pass the results to the callback
            callback(err, results, fields);
        });
    });
};
