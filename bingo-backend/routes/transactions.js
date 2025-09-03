const express = require('express');
const { body, param } = require('express-validator');
const transactionController = require('../controllers/transactionController');

const router = express.Router();

// Submit deposit
router.post(
  '/deposit',
  [
    body('playerId').notEmpty().withMessage('playerId is required'),
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('method').optional().isString()
  ],
  transactionController.submitDeposit
);

// Get all transactions
router.get('/', transactionController.getAllTransactions);

// Get transactions for specific player
router.get('/:id', param('id').notEmpty().withMessage('playerId is required'), transactionController.getPlayerTransactions);

module.exports = router;
