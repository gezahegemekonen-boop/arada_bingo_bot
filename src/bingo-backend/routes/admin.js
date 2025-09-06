import express from 'express';
import Payout from '../models/Payout.js';
import Player from '../models/Player.js';

const router = express.Router();

// ✅ Get all payouts (latest first)
router.get('/payouts', async (req, res) => {
  try {
    const payouts = await Payout.find().sort({ requestedAt: -1 });
    res.status(200).json({ success: true, payouts });
  } catch (err) {
    console.error('Admin payouts error:', err);
    res.status(500).json({ success: false, message: 'Server error while fetching payouts' });
  }
});

// ✅ Approve payout manually
router.post('/approve/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const payout = await Payout.findById(id);
    if (!payout) return res.status(404).json({ success: false, message: 'Payout not found' });

    payout.status = 'approved';
    payout.processedAt = new Date();
    await payout.save();

    res.status(200).json({ success: true, message: '✅ Payout approved' });
  } catch (err) {
    console.error('Approve error:', err);
    res.status(500).json({ success: false, message: 'Server error during approval' });
  }
});

// ✅ Reject payout manually
router.post('/reject/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const payout = await Payout.findById(id);
    if (!payout) return res.status(404).json({ success: false, message: 'Payout not found' });

    payout.status = 'rejected';
    payout.processedAt = new Date();
    await payout.save();

    // Optionally refund coins to player
    const player = await Player.findOne({ telegramId: payout.telegramId });
    if (player) {
      player.coins += payout.amount;
      await player.save();
    }

    res.status(200).json({ success: true, message: '❌ Payout rejected and coins refunded' });
  } catch (err) {
    console.error('Reject error:', err);
    res.status(500).json({ success: false, message: 'Server error during rejection' });
  }
});

export default router;
