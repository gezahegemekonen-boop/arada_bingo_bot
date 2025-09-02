// commands/player/leaderboard.js

const User = require('../../models/User');

module.exports = function (bot) {
  bot.onText(/\/leaderboard/, async (msg) => {
    const chatId = msg.chat.id;

    try {
      // Find users with successful referral bonuses
      const users = await User.find({ referralBonusGiven: true });

      // Count referrals per referrer
      const referralCounts = {};
      users.forEach(user => {
        if (user.referredBy) {
          referralCounts[user.referredBy] = (referralCounts[user.referredBy] || 0) + 1;
        }
      });

      // Sort and get top 5
      const sorted = Object.entries(referralCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      if (sorted.length === 0) {
        return await bot.sendMessage(chatId, '📉 No referrals yet.');
      }

      // Fetch all top users at once
      const topTelegramIds = sorted.map(([telegramId]) => telegramId);
      const topUsers = await User.find({ telegramId: { $in: topTelegramIds } });

      let message = '🏆 Top Referrers:\n\n';
      sorted.forEach(([telegramId, count], index) => {
        const user = topUsers.find(u => u.telegramId === telegramId);
        const name = user?.name || `User ${telegramId}`;
        message += `${index + 1}. ${name} — ${count} referrals\n`;
      });

      await bot.sendMessage(chatId, message);
    } catch (err) {
      console.error('❌ Error in /leaderboard:', err);
      await bot.sendMessage(chatId, '⚠️ Something went wrong while fetching the leaderboard.');
    }
  });
};

