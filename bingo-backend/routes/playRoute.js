const express = require('express');
const router = express.Router();
const { playBingo } = require('../controllers/playController');

router.post('/play', playBingo);

module.exports = router;
