import User from '../models/User.js';

export async function playGame(userId) {
  // 🔍 Find or create user
  let user = await User.findOne({ userId });
  if (!user) {
    user = new User({ userId });
  }

  // 🎲 Simulate win logic (50% chance)
  const didWin = Math.random() < 0.5;

  // 📊 Update stats
  user.gamesPlayed += 1;
  if (didWin) {
    user.wins += 1;
  }
  user.lastPlayedAt = new Date();

  await user.save();

  // 🗣️ Optional: trigger Amharic audio or Telegram voice message here

  return {
    win: didWin,
    message: didWin
      ? 'አመሰግናለሁ! You won Bingo!'
      : 'ደግመህ ሞክር። Try again!',
    stats: {
      gamesPlayed: user.gamesPlayed,
      wins: user.wins
    }
  };
}
