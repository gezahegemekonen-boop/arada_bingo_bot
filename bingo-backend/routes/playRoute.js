const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { playBingo } = require('../controllers/playController');

// ✅ POST /play with validation
router.post(
  '/play',
  [
    body('userId').isString().notEmpty().withMessage('userId is required'),
    body('card').isArray({ min: 1 }).withMessage('card must be a non-empty array'),
  ],
  playBingo
);

module.exports = router;
