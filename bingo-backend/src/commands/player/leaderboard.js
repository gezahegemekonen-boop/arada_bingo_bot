const User = require('../../models/User');

module.exports = (bot) => {
  bot.onText(/\/leaderboard/, async (msg) => {
    const chatId = msg.chat.id;

    const users = await User.find({ referralBonusGiven: true });
    const counts = {};
    users.forEach(u => {
      if (u.referredBy) counts[u.referredBy] = (counts[u.referredBy] || 0) + 1;
    });

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    if (!sorted.length) return bot.sendMessage(chatId, '📉 No referrals yet.');

    let message = '🏆 Top Referrers:\n';
    for (let i = 0; i < sorted.length; i++) {
      const [tid, count] = sorted[i];
      message += `${i + 1}. User ${tid} — ${count} referrals\n`;
    }

    bot.sendMessage(chatId, message);
  });
};
