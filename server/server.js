const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { registerUser, loginUser } = require('../db/db');

const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/signin-2.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/register-2.html'));
});

app.post('/register', async (req, res) => {
  const { name, email, password, cpassword } = req.body;
  const result = await registerUser(name, email, password, cpassword);
  res.status(result.status).json({ message: result.message });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const result = await loginUser(email, password);
  res.status(result.status).json({ message: result.message });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
