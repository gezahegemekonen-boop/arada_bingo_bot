import express from 'express';
import Transaction from '../models/Transaction.js';

const router = express.Router();

// ✅ Approve deposit
router.post('/approve/:id', async (req, res) => {
  const { id } = req.params;
  const { adminNote } = req.body;

  try {
    const tx = await Transaction.findById(id);
    if (!tx) return res.status(404).json({ error: 'Transaction not found' });

    tx.status = 'approved';
    tx.approvedAt = new Date();
    tx.adminNote = adminNote || '';
    await tx.save();

    res.json({ message: 'Deposit approved', transaction: tx });
  } catch (err) {
    res.status(500).json({ error: 'Approval failed' });
  }
});

// ❌ Reject deposit
router.post('/reject/:id', async (req, res) => {
  const { id } = req.params;
  const { adminNote } = req.body;

  try {
    const tx = await Transaction.findById(id);
    if (!tx) return res.status(404).json({ error: 'Transaction not found' });

    tx.status = 'rejected';
    tx.rejectedAt = new Date();
    tx.adminNote = adminNote || '';
    await tx.save();

    res.json({ message: 'Deposit rejected', transaction: tx });
  } catch (err) {
    res.status(500).json({ error: 'Rejection failed' });
  }
});

export default router;
