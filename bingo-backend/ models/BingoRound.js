import mongoose from 'mongoose';

const bingoRoundSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  roundId: {
    type: String,
    required: true
  },
  card: {
    type: [[mongoose.Schema.Types.Mixed]], // 5x5 grid
    required: true
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  hasWon: {
    type: Boolean,
    default: false
  },
  winType: {
    type: String,
    enum: ['row', 'column', 'diagonal', 'corners', null],
    default: null
  },
  stake: {
    type: Number,
    required: true,
    min: 1
  },
  payoutAmount: {
    type: Number,
    default: 0
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paidAt: {
    type: Date
  },
  adminNote: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'won', 'expired', 'paid'],
    default: 'pending'
  },
  isDemo: {
    type: Boolean,
    default: false
  },
  language: {
    type: String,
    enum: ['am', 'en'],
    default: 'am'
  }
}, { timestamps: true });

// Enforce uniqueness per user per round
bingoRoundSchema.index({ userId: 1, roundId: 1 }, { unique: true });

const BingoRound = mongoose.model('BingoRound', bingoRoundSchema);
export default BingoRound;
