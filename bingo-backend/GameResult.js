import mongoose from 'mongoose';

const gameResultSchema = new mongoose.Schema({
  userId: String,
  stake: Number,
  card: [[mongoose.Schema.Types.Mixed]], // 2D array of numbers + 'FREE'
  calledNumbers: [Number],
  won: Boolean,
  winType: String,
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('GameResult', gameResultSchema);
