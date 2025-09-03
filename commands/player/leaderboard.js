const User = require('../../models/User');

module.exports = function(bot) {
  bot.onText(/\/leaderboard/, async (msg) => {
    const chatId = msg.chat.id;

    const users = await User.find({ referralBonusGiven: true });
    let leaderboard = '🏆 Top Referrers:\n\n';
    let count = 1;

    users.forEach(u => {
      if (u.referredBy) {
        leaderboard += `${count++}. ${u.name || 'User'} — 1 referral\n`;
      }
    });

    bot.sendMessage(chatId, leaderboard || '📉 No referrals yet.');
  });
};
