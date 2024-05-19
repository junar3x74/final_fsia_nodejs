const mysql = require('mysql');
const bcrypt = require('bcrypt');
const { promisify } = require('util');
require('dotenv').config(); // Load environment variables from .env file


const connection = mysql.createConnection({
  host:'127.0.0.1',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Convert callback-based methods to promise-based
const queryAsync = promisify(connection.query).bind(connection);

// Function to register a user
async function registerUser(name, email, password, cpassword) {
  try {
    console.log('Received registration request:', { name, email, password, cpassword });

    if (!name || !email || !password || !cpassword) {
      return { status: 400, message: 'All fields are required' };
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase(); // Ensure email is lowercased
    const trimmedPassword = password.trim();
    const trimmedCPassword = cpassword.trim();

    if (trimmedPassword !== trimmedCPassword) {
      return { status: 400, message: 'Passwords do not match' };
    }

    const hashedPassword = await bcrypt.hash(trimmedPassword, 10);

    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    await queryAsync(query, [trimmedName, trimmedEmail, hashedPassword]);

    console.log('User registered successfully:', trimmedEmail);
    return { status: 201, message: 'User registered successfully' };
  } catch (error) {
    console.error('Error registering user:', error);
    return { status: 500, message: 'Internal server error' };
  }
}
// Function to login a user
async function loginUser(email, password) {
    try {
      console.log('Received login request for:', email);
  
      if (!email || !password) {
        return { status: 400, message: 'All fields are required' };
      }
  
      const trimmedEmail = email.trim().toLowerCase(); // Ensure email is lowercased
  
      const query = 'SELECT password FROM users WHERE email = ?'; // Retrieve only the password from the database
      const rows = await queryAsync(query, [trimmedEmail]);
  
      if (rows.length === 0) {
        console.log('User not found:', trimmedEmail);
        return { status: 404, message: 'User not found' };
      }
  
      const hashedPassword = rows[0].password; // Retrieve the hashed password from the database
  
      console.log('Hashed password from database:', hashedPassword);
  
      const passwordMatch = await bcrypt.compare(password, hashedPassword); // Compare input password with hashed password from database
      if (!passwordMatch) {
        console.log('Invalid password:', trimmedEmail);
        return { status: 401, message: 'Invalid password' };
      }
  
      console.log('Login successful:', trimmedEmail);
      return { status: 200, message: 'Login successful' };
    } catch (error) {
      console.error('Error logging in:', error);
      return { status: 500, message: 'Internal server error' };
    }
  }
  
  
  

module.exports = { registerUser, loginUser };
