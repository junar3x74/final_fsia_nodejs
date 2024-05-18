const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const db = require('../db/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));


app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'signin-2.html'));
});


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
            console.log('Invalid email or password');
            return res.status(401).send('Invalid email or password');
        }

        // Redirect to dashboard or homepage on successful login
        console.log('Redirecting to index.html');
        return res.redirect('/index.html');
    } catch (error) {
        // Handle any unexpected errors
        console.error('Error during login:', error);
        return res.status(500).send('Internal Server Error');
    }
});



app.post('/register', async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    try {
        
        if (!username || !email || !password || !confirmPassword) {
            return res.status(400).send('All fields are required');
        }

        
        if (password !== confirmPassword) {
            return res.status(400).send('Passwords do not match');
        }

        
        const hashedPassword = await bcrypt.hash(password, 10);

        
        await db.createUser(username, email, hashedPassword);

        
        res.redirect('/signin-2.html');
    } catch (error) {
        
        console.error('Error during registration:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/', (req, res) => {
    res.redirect('/login');
});


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
