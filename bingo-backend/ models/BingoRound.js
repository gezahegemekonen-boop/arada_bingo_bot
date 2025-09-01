const mongoose = require('mongoose');

const bingoRoundSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  roundId: { type: String, required: true },
  card: { type: [[mongoose.Schema.Types.Mixed]], required: true }, // 5x5 grid
  joinedAt: { type: Date, default: Date.now },
  hasWon: { type: Boolean, default: false },
  winType: { type: String, enum: ["row", "column", "diagonal", "corners", null], default: null },
  stake: { type: Number, required: true }
});

// Optional: enforce uniqueness per user per round
bingoRoundSchema.index({ userId: 1, roundId: 1 }, { unique: true });

module.exports = mongoose.model('BingoRound', bingoRoundSchema);
