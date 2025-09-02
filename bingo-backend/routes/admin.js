import express from 'express';
import Transaction from '../models/Transaction.js';
import BingoRound from '../models/BingoRound.js';

const router = express.Router();

// Optional: Simple admin token check
const requireAdmin = (req, res, next) => {
  const token = req.headers['x-admin-token'];
  if (token !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  next();
};

// ✅ Approve deposit
router.post('/approve/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { adminNote } = req.body;

  try {
    const tx = await Transaction.findById(id);
    if (!tx) return res.status(404).json({ error: 'Transaction not found' });

    tx.status = 'approved';
    tx.approvedAt = new Date();
    tx.adminNote = adminNote || '';
    await tx.save();

    res.json({ message: '✅ Deposit approved', transaction: tx });
  } catch (err) {
    console.error('❌ Deposit approval error:', err.message);
    res.status(500).json({ error: 'Approval failed' });
  }
});

// ❌ Reject deposit
router.post('/reject/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { adminNote } = req.body;

  try {
    const tx = await Transaction.findById(id);
    if (!tx) return res.status(404).json({ error: 'Transaction not found' });

    tx.status = 'rejected';
    tx.rejectedAt = new Date();
    tx.adminNote = adminNote || '';
    await tx.save();

    res.json({ message: '❌ Deposit rejected', transaction: tx });
  } catch (err) {
    console.error('❌ Deposit rejection error:', err.message);
    res.status(500).json({ error: 'Rejection failed' });
  }
});

// 💸 Approve Bingo payout
router.post('/payout/:roundId', requireAdmin, async (req, res) => {
  const { roundId } = req.params;
  const { adminNote } = req.body;

  try {
    const round = await BingoRound.findOne({ roundId });
    if (!round || !round.hasWon) {
      return res.status(404).json({ error: 'Round not found or not won' });
    }

    round.isPaid = true;
    round.status = 'paid';
    round.adminNote = adminNote || '';
    round.paidAt = new Date();
    await round.save();

    res.json({ message: '💰 Payout approved', round });
  } catch (err) {
    console.error('❌ Payout approval error:', err.message);
    res.status(500).json({ error: 'Payout approval failed' });
  }
});

// 📊 View pending deposits
router.get('/pending-deposits', requireAdmin, async (req, res) => {
  try {
    const pendingTxs = await Transaction.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.json({ transactions: pendingTxs });
  } catch (err) {
    console.error('❌ Fetch pending deposits error:', err.message);
    res.status(500).json({ error: 'Failed to fetch pending deposits' });
  }
});

// 📊 View unpaid Bingo wins
router.get('/pending-payouts', requireAdmin, async (req, res) => {
  try {
    const pendingRounds = await BingoRound.find({ hasWon: true, isPaid: false }).sort({ joinedAt: -1 });
    res.json({ rounds: pendingRounds });
  } catch (err) {
    console.error('❌ Fetch pending payouts error:', err.message);
    res.status(500).json({ error: 'Failed to fetch pending payouts' });
  }
});

export default router;
