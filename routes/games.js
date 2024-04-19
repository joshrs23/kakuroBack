const { Router } = require('express');
const express = require('express');
const router = express.Router();
const{CreateGame,Evaulatemove} = require('../controllers/games')

router.post('/create-game', CreateGame);
router.post('/evaluate-move', Evaulatemove);


module.exports = router;