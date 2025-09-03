import Transaction from '../models/Transaction.js';

// 🟢 Submit a deposit
export const submitDeposit = async (req, res) => {
  try {
    const { playerId, amount, method } = req.body;

    if (!playerId || !amount) {
      return res.status(400).json({ error: 'playerId and amount are required' });
    }

    const tx = new Transaction({
      playerId,
      amount,
      type: 'deposit',
      method: method || 'Telebirr',
      status: 'pending'
    });

    await tx.save();
    res.status(201).json({ message: 'Deposit submitted', transaction: tx });
  } catch (err) {
    console.error('❌ Deposit submission error:', err.message);
    res.status(500).json({ error: 'Failed to submit deposit' });
  }
};

// 📄 Get all transactions
export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

// 📄 Get transactions for a specific player
export const getPlayerTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ playerId: req.params.id }).sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch player transactions' });
  }
};

// ✅ Approve transaction
export const approveTransaction = async (req, res) => {
  try {
    const tx = await Transaction.findById(req.params.id);
    if (!tx) return res.status(404).json({ error: 'Transaction not found' });

    tx.status = 'approved';
    tx.approvedAt = new Date();
    await tx.save();

    res.status(200).json({ message: 'Transaction approved', transaction: tx });
  } catch (err) {
    res.status(500).json({ error: 'Approval failed' });
  }
};

// ❌ Reject transaction
export const rejectTransaction = async (req, res) => {
  try {
    const tx = await Transaction.findById(req.params.id);
    if (!tx) return res.status(404).json({ error: 'Transaction not found' });

    tx.status = 'rejected';
    tx.rejectedAt = new Date();
    await tx.save();

    res.status(200).json({ message: 'Transaction rejected', transaction: tx });
  } catch (err) {
    res.status(500).json({ error: 'Rejection failed' });
  }
};
