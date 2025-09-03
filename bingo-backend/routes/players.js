const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const playController = require('../controllers/playController');

// GET /players — fetch all players
router.get('/', playerController.getAllPlayers);

// GET /players/:id — fetch one player by telegramId
router.get(
  '/:id',
  param('id').notEmpty().withMessage('telegramId is required'),
  playerController.getPlayer
);

// PUT /players/:id — update wallet or coins
router.put(
  '/:id',
  [
    param('id').notEmpty().withMessage('telegramId is required'),
    body('wallet').optional().isNumeric().withMessage('wallet must be a number'),
    body('coins').optional().isNumeric().withMessage('coins must be a number')
  ],
  playerController.updatePlayer
);

module.exports = router;
