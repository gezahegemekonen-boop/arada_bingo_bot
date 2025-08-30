import express from 'express';
import { playGame } from '../utils/game.js';

const router = express.Router();

router.post('/play', async (req, res) => {
  const { userId } = req.body;

  // 🧼 Validate input
  if (!userId || typeof userId !== 'string' || userId.trim().length < 5) {
    return res.status(400).json({ error: 'Invalid or missing userId' });
  }

  try {
    // 🎯 Run game logic
    const result = await playGame(userId);

    // 📤 Return result
    res.json(result);
  } catch (error) {
    console.error('❌ Error in /play route:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
