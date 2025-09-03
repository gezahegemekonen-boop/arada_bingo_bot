const express = require('express');
const { body } = require('express-validator');
const { playBingo } = require('../controllers/playController');
const router = express.Router();

router.post(
  '/play',
  [body('userId').isString().notEmpty().withMessage('userId is required')],
  playBingo
);

module.exports = router;
