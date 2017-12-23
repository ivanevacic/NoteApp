const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

//User login route
router.get('/users/login', (req, res)=> {
  res.send('login');
});

//User register route
router.get('/users/register', (req, res)=> {
  res.send('register');
});



module.exports = router;