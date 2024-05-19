const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Configure express-session
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set secure to true if using HTTPS
}));


// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, './public')));

// Routes
app.get('/', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send('You need to log in first');
  }
  else{
    res.sendFile(path.join(__dirname, './public/index.html'));
  }
  
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, './public/signin-2.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, './public/register-2.html'));
});


app.use('/api/users', userRoutes);


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
