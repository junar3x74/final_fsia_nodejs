const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const db = require('../db/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

// Serve login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'signin-2.html'));
});

// Serve registration page
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'register-2.html'));
});

// Handle login form submission
app.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await getUserByEmail(email);

        if (!user) {
            return res.status(401).send('Invalid email or password');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            return res.send('Login successful');
        } else {
            return res.status(401).send('Invalid email or password');
        }
    } catch (err) {
        next(err);
    }
});

// Handle registration form submission
app.post('/register', async (req, res, next) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        if (!username || !email || !password || !confirmPassword) {
            return res.status(400).send('All fields are required');
        }

        if (password !== confirmPassword) {
            return res.status(400).send('Passwords do not match');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await createUser(username, email, hashedPassword);

        res.send('Registration successful');
    } catch (err) {
        next(err);
    }
});


app.get('/', (req, res) => {
    res.redirect('/login');
});


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

// Database functions
async function getUserByEmail(email) {
    try {
        const sql = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await db.query(sql, [email]);
        console.log(rows); 
        return rows.length ? rows[0] : null;
    } catch (error) {
        throw error;
    }
}


async function createUser(username, email, hashedPassword) {
    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    await db.query(sql, [username, email, hashedPassword]);
}
