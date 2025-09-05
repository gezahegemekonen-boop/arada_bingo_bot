// bingo-backend/src/models/BingoRound.js
import mongoose from 'mongoose';

const bingoRoundSchema = new mongoose.Schema({
  roundNumber: Number,
  drawnNumbers: [Number],
  isActive: Boolean,
  winners: [{
    playerId: mongoose.Schema.Types.ObjectId,
    prize: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const BingoRound = mongoose.model('BingoRound', bingoRoundSchema);
export default BingoRound;
