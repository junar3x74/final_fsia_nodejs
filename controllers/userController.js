const bcrypt = require('bcrypt');
const { queryAsync } = require('../db');


// Function to register a user
async function registerUser(username, email, password) {
  const trimmedName = username.trim();
  const trimmedEmail = email.trim().toLowerCase();

  try {
      
      const hashedPassword = await bcrypt.hash(password, 10);

      
      const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      await queryAsync(query, [trimmedName, trimmedEmail, hashedPassword]);

      console.log('User registered successfully:', trimmedEmail);
      return { status: 201, message: 'User registered successfully', redirectTo: '/login' };
  } catch (error) {
      
      if (error.code === 'ER_DUP_ENTRY') {
          console.log('Email already taken:', trimmedEmail);
          return { status: 400, message: 'Email already taken' };
      }

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

    const trimmedEmail = email.trim().toLowerCase();

    const query = 'SELECT id, password FROM users WHERE email = ?';
    const rows = await queryAsync(query, [trimmedEmail]);

    if (rows.length === 0) {
      console.log('User not found:', trimmedEmail);
      return { status: 404, message: 'User not found' };
      
    }

    const userId = rows[0].id;
    const hashedPassword = rows[0].password;

    console.log('Hashed password from database:', hashedPassword);

    const passwordMatch = await bcrypt.compare(password, hashedPassword);
    if (!passwordMatch) {
      console.log('Invalid password:', trimmedEmail);
      return { status: 401, message: 'Invalid password' };
    }

    console.log('Login successful:', trimmedEmail);
    return { status: 200, message: 'Login successful', userId, redirectTo: '/' };
  } catch (error) {
    console.error('Error logging in:', error);
    return { status: 500, message: 'Internal server error' };
  }
}



module.exports = { registerUser, loginUser };
