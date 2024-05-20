const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = 3000;

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Set the views directory


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Configure express-session
app.use(session({
  secret: '3e5d6f5d2a4b5f1e6b7d8a9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w',
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
    res.render('index', { userId: req.session.userId, username: req.session.username });
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
