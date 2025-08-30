import express from 'express';
import { playGame } from '../utils/game.js';

const router = express.Router();

router.post('/play', async (req, res) => {
  const { userId } = req.body;

  if (!userId || typeof userId !== 'string' || userId.length < 5) {
    return res.status(400).json({ error: 'Invalid or missing userId' });
  }

  try {
    const result = await playGame(userId);
    res.json(result);
  } catch (err) {
    console.error('❌ Error in playGame:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
