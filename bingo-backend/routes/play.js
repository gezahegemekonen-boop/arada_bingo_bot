import express from 'express';
import { body } from 'express-validator';
import { playBingo } from '../controllers/playController.js';

const router = express.Router();

router.post(
  '/play',
  [
    body('userId').isString().notEmpty().withMessage('userId is required')
    // Card is generated server-side
  ],
  playBingo
);

export default router;
