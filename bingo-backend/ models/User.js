import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  gamesPlayed: { type: Number, default: 0 },
  wins: { type: Number, default: 0 },
  lastPlayedAt: { type: Date, default: null }
});

const User = mongoose.model('User', userSchema);
export default User;

