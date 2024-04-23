const { Router } = require('express');
const express = require('express');
const router = express.Router();
const{StartGame,Evaluatemove,QuitGame,SaveGame,validateGame} = require('../controllers/games')

router.post('/create-game', StartGame);
router.post('/evaluate-move', Evaluatemove);
router.post('/stop-game', QuitGame);
router.post('/save-game', SaveGame);
router.post('/validate-game', validateGame);


module.exports = router;