const { Router } = require('express');
const express = require('express');
const router = express.Router();
const{userLogIn, createUser,userEmail} = require('../controllers/users')

router.post('/sign-in', userLogIn);
router.post('/registration', createUser);
router.post('/email-password', userEmail);


module.exports = router;