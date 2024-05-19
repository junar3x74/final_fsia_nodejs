const express = require('express');
const path = require('path');
const { registerUser, loginUser } = require('../db/db');

const app = express();

// Middleware to serve static files from the public folder
app.use(express.static(path.join(__dirname, '../public')));

// Middleware to parse URL-encoded bodies (form data)
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());

// Registration Route (POST)
app.post('/register', async (req, res) => {
  try {
    console.log('Request body:', req.body);
    const { name, email, password, cpassword } = req.body;
    const result = await registerUser(name, email, password, cpassword);
    res.status(result.status).json({ message: result.message });
  } catch (error) {
    console.error('Error in /register route:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login Route (POST)
app.post('/login', async (req, res) => {
  try {
    console.log('Request body:', req.body);
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    res.status(result.status).json({ message: result.message });
  } catch (error) {
    console.error('Error in /login route:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
