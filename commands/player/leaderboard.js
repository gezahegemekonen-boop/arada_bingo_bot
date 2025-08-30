const User = require('../../models/User');

module.exports = function(bot) {
  bot.onText(/\/leaderboard/, async (msg) => {
    const chatId = msg.chat.id;

    // Find users with most successful referrals
    const users = await User.find({ referralBonusGiven: true });

    // Count referrals per user
    const referralCounts = {};
    users.forEach(user => {
      if (user.referredBy) {
        referralCounts[user.referredBy] = (referralCounts[user.referredBy] || 0) + 1;
      }
    });

    // Sort by count
    const sorted = Object.entries(referralCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5); // Top 5

    if (sorted.length === 0) {
      return bot.sendMessage(chatId, '📉 No referrals yet.');
    }

    let message = '🏆 Top Referrers:\n\n';
    for (let i = 0; i < sorted.length; i++) {
      const [telegramId, count] = sorted[i];
      const user = await User.findOne({ telegramId });
      const name = user?.name || `User ${telegramId}`;
      message += `${i + 1}. ${name} — ${count} referrals\n`;
    }

    bot.sendMessage(chatId, message);
  });
};
