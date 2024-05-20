const bcrypt = require('bcrypt');
const { queryAsync } = require('../db');


// Function to register a user
async function registerUser(name, email, password, cpassword) {
  try {
    console.log('Received registration request:', { name, email, password, cpassword });

    if (!name || !email || !password || !cpassword) {
      return { status: 400, message: 'All fields are required' };
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();
    const trimmedCPassword = cpassword.trim();

    if (trimmedPassword !== trimmedCPassword) {
      return { status: 400, message: 'Passwords do not match' };
    }

    const hashedPassword = await bcrypt.hash(trimmedPassword, 10);

    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    await queryAsync(query, [trimmedName, trimmedEmail, hashedPassword]);

    console.log('User registered successfully:', trimmedEmail);
    return { status: 201, message: 'User registered successfully', redirectTo: '/login' };
  } catch (error) {
    console.error('Error registering user:', error);
    return { status: 500, message: 'Internal server error' };
  }
}

// Function to login a user
async function loginUser( req, email, password) {
  try {
    console.log('Received login request for:', email);

    if (!email || !password) {
      return { status: 400, message: 'All fields are required' };
    }

    const trimmedEmail = email.trim().toLowerCase();

    const query = 'SELECT id, username, password FROM users WHERE email = ?';
    const rows = await queryAsync(query, [trimmedEmail]);

    if (rows.length === 0) {
      console.log('User not found:', trimmedEmail);
      return { status: 404, message: 'User not found' };
    }

    const userId = rows[0].id;
    const hashedPassword = rows[0].password;
    const userName = rows[0].username;

    console.log('Hashed password from database:', hashedPassword);

    const passwordMatch = await bcrypt.compare(password, hashedPassword);
    if (!passwordMatch) {
      console.log('Invalid password:', trimmedEmail);
      return { status: 401, message: 'Invalid password' };
    }

    // Set session variables
    req.session.userId = userId;
    req.session.username = userName;
    req.session.email = email;

    console.log('Login successful:', trimmedEmail);
    return { status: 200, message: 'Login successful', redirectTo: '/' };
  } catch (error) {
    console.error('Error logging in:', error);
    return { status: 500, message: 'Internal server error' };
  }
}



module.exports = { registerUser, loginUser };
