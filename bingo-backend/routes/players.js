const express = require('express');
const { body, param } = require('express-validator');
const { getAllPlayers, getPlayer, updatePlayer } = require('../controllers/playController');

const router = express.Router();

// GET all players
router.get('/', getAllPlayers);

// GET single player by telegramId
router.get('/:id', param('id').notEmpty().withMessage('telegramId required'), getPlayer);

// PATCH update player
router.patch('/:id', updatePlayer);

module.exports = router;
