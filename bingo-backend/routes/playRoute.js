const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { playBingo } = require('../controllers/playController');

// ✅ POST /api/play with validation
router.post(
  '/play',
  [
    body('userId').isString().notEmpty().withMessage('userId is required'),
    // 🔥 Removed card validation — it's generated server-side
  ],
  playBingo
);

module.exports = router;
