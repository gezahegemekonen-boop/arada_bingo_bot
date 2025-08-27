const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  telegramId: {
    type: String,
    required: true,
    unique: true,
  },
  balance: {
    type: Number,
    default: 10, // First-time bonus
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  currentStake: {
    type: Number,
    default: null, // e.g. 10, 20, 50 ETB
  },
  lastJoinedRound: {
    type: String,
    default: null, // Used to prevent double-charging
  },
  card: {
    type: mongoose.Schema.Types.Mixed,
    default: null, // Stores assigned Bingo card
  },
  language: {
    type: String,
    default: 'en', // 'am' for Amharic
  },
  isApproved: {
    type: Boolean,
    default: true, // For deposit approval flow
  }
}, { timestamps: true });

module.exports = mongoose.model('Player', playerSchema);
