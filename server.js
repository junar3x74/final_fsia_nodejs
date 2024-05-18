const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const db = require('./db/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// Serve login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'signin-2.html'));
});

// Serve registration page
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'register-2.html'));
});

// Handle login form submission
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Retrieve user from database based on email
        const user = await db.getUserByEmail(email);

        // If user not found or password doesn't match, return error
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send('Invalid email or password');
        }

        // Redirect to index.html upon successful login
        return res.redirect('/index.html');
    } catch (error) {
        // Handle any unexpected errors
        console.error('Error during login:', error);
        return res.status(500).send('Internal Server Error');
    }
});

// Handle registration form submission
app.post('/register', async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    try {
        // Check if any field is empty
        if (!username || !email || !password || !confirmPassword) {
            return res.status(400).send('All fields are required');
        }

        // Check if password and confirm password match
        if (password !== confirmPassword) {
            return res.status(400).send('Passwords do not match');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user in the database
        await db.createUser(username, email, hashedPassword);

        // Redirect to signin-2.html upon successful registration
        return res.redirect('/signin-2.html?success=1');
    } catch (error) {
        // Handle any unexpected errors
        console.error('Error during registration:', error);
        return res.status(500).send('Internal Server Error');
    }
});

// Redirect root endpoint to login page
app.get('/', (req, res) => {
    res.redirect('/login');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
