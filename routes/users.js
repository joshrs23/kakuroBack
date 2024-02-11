const { Router } = require('express');
const express = require('express');
const router = express.Router();
const{userSignIn} = require('../controllers/users')

router.post('/sign-in', userSignIn);
module.exports = router;