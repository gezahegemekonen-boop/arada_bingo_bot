import express from 'express';
import { body, param } from 'express-validator';
import transactionController from '../controllers/transactionController.js';

const router = express.Router();

// 🟢 Submit a deposit
router.post(
  '/deposit',
  [
    body('playerId').notEmpty().withMessage('playerId is required'),
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('method').optional().isString()
  ],
  transactionController.submitDeposit
);

// 📄 Get all transactions (optional, for admin or debugging)
router.get('/', transactionController.getAllTransactions);

// 📄 Get transactions for a specific player
router.get(
  '/:id',
  param('id').notEmpty().withMessage('playerId is required'),
  transactionController.getPlayerTransactions
);

export default router;
