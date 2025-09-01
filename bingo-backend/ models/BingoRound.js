const mongoose = require('mongoose');

const bingoRoundSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Changed from ObjectId to String
  roundId: { type: String, required: true },
  card: { type: [[mongoose.Schema.Types.Mixed]], required: true }, // 5x5 grid
  joinedAt: { type: Date, default: Date.now },
  hasWon: { type: Boolean, default: false },
  winType: {
    type: String,
    enum: ["row", "column", "diagonal", "corners", null],
    default: null
  },
  stake: { type: Number, required: true },

  // ✅ New fields
  status: {
    type: String,
    enum: ["pending", "won", "expired"],
    default: "pending"
  },
  isDemo: { type: Boolean, default: false }
});

// Optional: enforce uniqueness per user per round
bingoRoundSchema.index({ userId: 1, roundId: 1 }, { unique: true });

module.exports = mongoose.model('BingoRound', bingoRoundSchema);
