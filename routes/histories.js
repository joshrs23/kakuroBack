const { Router } = require('express');
const express = require('express');
const router = express.Router();
const{getHistories, getHistoryUser,addHistoryUser} = require('../controllers/histories')

router.post('/get-records', getHistories);
router.post('/get-user-history', getHistoryUser);
router.post('/add-history', addHistoryUser);


module.exports = router;