const { Router } = require('express');
const express = require('express');
const router = express.Router();
const{CreateGame} = require('../controllers/games')

router.post('/create-game', CreateGame);


module.exports = router;