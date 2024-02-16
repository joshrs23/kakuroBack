const { Router } = require('express');
const express = require('express');
const router = express.Router();
const{userLogIn, createUser} = require('../controllers/users')

router.post('/sign-in', userLogIn);
router.post('/registration', createUser);


module.exports = router;