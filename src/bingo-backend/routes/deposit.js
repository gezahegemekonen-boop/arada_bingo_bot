import express from 'express';
import Player from '../models/Player.js';

const router = express.Router();

// POST /deposit — user submits deposit request
router.post('/', async (req, res) => {
  const { telegramId, amount, method, txId } = req.body;

  if (!telegramId || !amount || !method || !txId) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  if (amount < 30) {
    return res.status(400).json({ success: false, message: 'Minimum deposit is 30 Br' });
  }

  if (!['CBE', 'CBE_BIRR', 'TELEBIRR'].includes(method)) {
    return res.status(400).json({ success: false, message: 'Invalid deposit method' });
  }

  try {
    const player = await Player.findOne({ telegramId });
    if (!player) {
      return res.status(404).json({ success: false, message: 'Player not found' });
    }

    player.coins += amount;
    await player.save();

    res.status(200).json({ success: true, message: `✅ Deposit of ${amount} Br via ${method} received`, coins: player.coins });
  } catch (err) {
    console.error('Deposit error:', err);
    res.status(500).json({ success: false, message: 'Server error during deposit' });
  }
});

export default router;
