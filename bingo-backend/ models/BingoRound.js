import mongoose from 'mongoose';

const bingoRoundSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  roundId: {
    type: String,
    required: true,
    unique: true
  },
  card: {
    type: [[mongoose.Schema.Types.Mixed]], // 2D array of numbers + 'FREE'
    required: true
  },
  hasWon: {
    type: Boolean,
    default: false
  },
  stake: {
    type: Number,
    default: 1
  },
  payoutAmount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'won', 'lost'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const BingoRound = mongoose.model('BingoRound', bingoRoundSchema);
export default BingoRound;
