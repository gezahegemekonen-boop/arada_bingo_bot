const Transaction = require('../models/Transaction');

// Get all transactions
exports.getAllTransactions = async (req, res) => {
  const transactions = await Transaction.find();
  res.json(transactions);
};

// Get transactions for a specific player
exports.getPlayerTransactions = async (req, res) => {
  const transactions = await Transaction.find({ playerId: req.params.id }).sort({ createdAt: -1 });
  res.json(transactions);
};

// Approve transaction
exports.approveTransaction = async (req, res) => {
  const tx = await Transaction.findById(req.params.id);
  if (!tx) return res.status(404).json({ message: 'Transaction not found' });

  tx.approved = true;
  tx.rejected = false;
  await tx.save();
  res.json(tx);
};

// Reject transaction
exports.rejectTransaction = async (req, res) => {
  const tx = await Transaction.findById(req.params.id);
  if (!tx) return res.status(404).json({ message: 'Transaction not found' });

  tx.approved = false;
  tx.rejected = true;
  await tx.save();
  res.json(tx);
};
