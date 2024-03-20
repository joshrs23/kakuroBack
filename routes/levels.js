const { Router } = require('express');
const express = require('express');
const router = express.Router();
const {getLevels, getLevel } = require('../controllers/levels'); 

router.get('/get-levels', getLevels);
router.get('/get-level', getLevel);

module.exports = router;
