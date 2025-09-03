const Transaction = require('../models/Transaction');
const Player = require('../models/Player');

exports.submitDeposit = async (req, res) => {
  try {
    const { playerId, amount, method } = req.body;
    if (!playerId || !amount) return res.status(400).json({ message: 'playerId and amount required' });

    const tx = await Transaction.create({ playerId, amount, type: 'deposit', method });
    res.status(201).json({ message: 'Deposit submitted', transaction: tx });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to submit deposit' });
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
};

exports.getPlayerTransactions = async (req, res) => {
  try {
    const { id } = req.params;
    const transactions = await Transaction.find({ playerId: id }).sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch player transactions' });
  }
};
