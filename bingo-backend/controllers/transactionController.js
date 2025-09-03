import Transaction from '../models/Transaction.js';
import Player from '../models/Player.js';

// 🟢 Submit a deposit
const submitDeposit = async (req, res) => {
  try {
    const { playerId, amount, method } = req.body;

    const player = await Player.findOne({ telegramId: playerId });
    if (!player) return res.status(404).json({ message: 'Player not found' });

    const transaction = await Transaction.create({
      playerId,
      amount,
      type: 'deposit',
      method: method || 'Telebirr'
    });

    res.status(201).json({ message: 'Deposit submitted', transaction });
  } catch (err) {
    console.error('❌ Deposit submission error:', err);
    res.status(500).json({ message: 'Failed to submit deposit' });
  }
};

// 📄 Get all transactions
const getAllTransactions = async (_req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (err) {
    console.error('❌ Fetch transactions error:', err);
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
};

// 📄 Get transactions for a specific player
const getPlayerTransactions = async (req, res) => {
  try {
    const { id } = req.params;
    const transactions = await Transaction.find({ playerId: id }).sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (err) {
    console.error('❌ Fetch player transactions error:', err);
    res.status(500).json({ message: 'Failed to fetch player transactions' });
  }
};

export default { submitDeposit, getAllTransactions, getPlayerTransactions };
