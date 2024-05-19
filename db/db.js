const mysql = require('mysql');
const bcrypt = require('bcrypt');
const { promisify } = require('util');

// MySQL Connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'smartstock_db'
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

    // Trim input values to remove whitespace characters
    if (!name || !email || !password || !cpassword) {
      return { status: 400, message: 'All fields are required' };
    }
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedCPassword = cpassword.trim();

    // Check if password and confirm password match
    if (trimmedPassword !== trimmedCPassword) {
      console.log('Passwords do not match:', trimmedPassword, trimmedCPassword);
      return { status: 400, message: 'Passwords do not match' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(trimmedPassword, 10);

    // Insert new user into the database
    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
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

    // Trim input values to remove whitespace characters
    if (!email || !password) {
      return { status: 400, message: 'All fields are required' };
    }
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // Retrieve user from the database by email
    const query = 'SELECT * FROM users WHERE email = ?';
    const rows = await queryAsync(query, [trimmedEmail]);

    if (rows.length === 0) {
      console.log('User not found:', trimmedEmail);
      return { status: 404, message: 'User not found' };
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(trimmedPassword, rows[0].password);
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
