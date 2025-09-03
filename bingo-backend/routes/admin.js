const express = require('express');
const { body, param } = require('express-validator');
const Transaction = require('../models/Transaction');
const BingoRound = require('../models/BingoRound');

const router = express.Router();

// Admin auth middleware
const requireAdmin = (req, res, next) => {
  const token = req.headers['x-admin-token'];
  if (token !== process.env.ADMIN_SECRET) return res.status(403).json({ error: 'Unauthorized' });
  next();
};

// Approve deposit
router.post(
  '/approve/:id',
  requireAdmin,
  async (req, res) => {
    try {
      const tx = await Transaction.findById(req.params.id);
      if (!tx) return res.status(404).json({ error: 'Transaction not found' });

      tx.status = 'approved';
      tx.approvedAt = new Date();
      tx.adminNote = req.body.adminNote || '';
      await tx.save();

      res.status(200).json({ message: '✅ Deposit approved', transaction: tx });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Approval failed' });
    }
  }
);

// Reject deposit
router.post(
  '/reject/:id',
  requireAdmin,
  async (req, res) => {
    try {
      const tx = await Transaction.findById(req.params.id);
      if (!tx) return res.status(404).json({ error: 'Transaction not found' });

      tx.status = 'rejected';
      tx.rejectedAt = new Date();
      tx.adminNote = req.body.adminNote || '';
      await tx.save();

      res.status(200).json({ message: '❌ Deposit rejected', transaction: tx });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Rejection failed' });
    }
  }
);

// Approve Bingo payout
router.post(
  '/payout/:roundId',
  requireAdmin,
  async (req, res) => {
    try {
      const round = await BingoRound.findOne({ roundId: req.params.roundId });
      if (!round || !round.hasWon) return res.status(404).json({ error: 'Round not found or not won' });

      round.isPaid = true;
      round.status = 'paid';
      round.adminNote = req.body.adminNote || '';
      round.paidAt = new Date();
      await round.save();

      res.status(200).json({ message: '💰 Payout approved', round });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Payout approval failed' });
    }
  }
);

// Pending deposits
router.get('/pending-deposits', requireAdmin, async (req, res) => {
  try {
    const pendingTxs = await Transaction.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.status(200).json({ transactions: pendingTxs });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch pending deposits' });
  }
});

// Pending payouts
router.get('/pending-payouts', requireAdmin, async (req, res) => {
  try {
    const pendingRounds = await BingoRound.find({ hasWon: true, isPaid: false }).sort({ joinedAt: -1 });
    res.status(200).json({ rounds: pendingRounds });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch pending payouts' });
  }
});

// Stats
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const [depositAgg] = await Transaction.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: null, sum: { $sum: '$amount' } } }
    ]);

    const [payoutAgg] = await BingoRound.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, sum: { $sum: '$payoutAmount' } } }
    ]);

    const activeUsers = await BingoRound.distinct('userId');

    res.status(200).json({
      totalDeposits: depositAgg?.sum || 0,
      totalPayouts: payoutAgg?.sum || 0,
      activeUsers: activeUsers.length
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
