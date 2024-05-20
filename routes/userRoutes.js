const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password, cpassword } = req.body;
  const result = await registerUser(name, email, password, cpassword);
  if (result.status === 201) {
    res.json(result);
  } else {
    res.status(result.status).json(result);
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const result = await loginUser(req, email, password);
  res.status(result.status).json(result);
});

module.exports = router;