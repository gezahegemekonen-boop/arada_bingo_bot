import express from 'express';
import Player from '../models/Player.js';

const router = express.Router();

// ✅ Health check
router.get('/', (req, res) => {
  res.send('Players route is working ✅');
});

// ✅ Simulate Bingo play
router.post('/:telegramId/play', async (req, res) => {
  const { telegramId } = req.params;

  try {
    const player = await Player.findOne({ telegramId });
    if (!player) {
      return res.status(404).json({ success: false, message: 'Player not found' });
    }

    player.coins += 5;
    player.wins += 1;
    await player.save();

    res.status(200).json({
      success: true,
      message: 'Bingo played successfully',
      coins: player.coins,
      wins: player.wins
    });
  } catch (err) {
    console.error('Play error:', err);
    res.status(500).json({ success: false, message: 'Server error during play' });
  }
});

// ✅ Leaderboard route
router.get('/leaderboard', async (req, res) => {
  try {
    const topPlayers = await Player.find({})
      .sort({ wins: -1 })
      .limit(10)
      .select('telegramId username wins referralCoins');

    res.status(200).json({
      success: true,
      leaderboard: topPlayers
    });
  } catch (err) {
    console.error('Leaderboard error:', err);
    res.status(500).json({ success: false, message: 'Server error while fetching leaderboard' });
  }
});

export default router;
