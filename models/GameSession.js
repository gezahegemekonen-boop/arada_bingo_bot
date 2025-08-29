import mongoose from 'mongoose';

const GameSessionSchema = new mongoose.Schema({
  userId: String,
  card: [[Number]], // 2D array for Bingo card
  calledNumbers: [Number],
  createdAt: { type: Date, default: Date.now },
  isWinner: { type: Boolean, default: false }
});

export default mongoose.model('GameSession', GameSessionSchema);
