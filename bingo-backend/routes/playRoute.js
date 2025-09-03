const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { playBingo } = require('../controllers/playController');

// POST /play — play bingo
router.post(
  '/play',
  [
    body('userId').isString().notEmpty().withMessage('userId is required')
  ],
  playBingo
);

module.exports = router;
