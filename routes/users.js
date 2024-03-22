const { Router } = require('express');
const express = require('express');
const router = express.Router();
const{userLogIn, createUser,userEmail,recoveryUserWeb,recoveryUserLink} = require('../controllers/users')

router.post('/sign-in', userLogIn);
router.post('/registration', createUser);
router.post('/email-password', userEmail);
router.post('/recover-l-password', recoveryUserLink);
router.post('/recover-password', recoveryUserWeb);


module.exports = router;