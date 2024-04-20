const { Router } = require('express');
const express = require('express');
const router = express.Router();
const{CreateGame,Evaulatemove,StopGame,SavingGame} = require('../controllers/games')

router.post('/create-game', CreateGame);
router.post('/evaluate-move', Evaulatemove);
router.post('/stop-game', StopGame);
router.post('/save-game', SavingGame);


module.exports = router;