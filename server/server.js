const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const db = require('../db/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
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
    const user = await db.getUserByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).send('Invalid email or password');
    }

    res.send('Login successful');
});

// Handle registration form submission
app.post('/register', async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
        return res.status(400).send('All fields are required');
    }

    if (password !== confirmPassword) {
        return res.status(400).send('Passwords do not match');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.createUser(username, email, hashedPassword);

    res.send('Registration successful');
});

// Redirect root endpoint to login page
app.get('/', (req, res) => {
    res.redirect('/login');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
