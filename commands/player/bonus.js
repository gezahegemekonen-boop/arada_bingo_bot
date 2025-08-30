const User = require('../../models/User');

module.exports = function(bot) {
  bot.onText(/\/bonus/, async (msg) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id.toString();

    const user = await User.findOne({ telegramId });
    if (!user) return bot.sendMessage(chatId, '🙈 Player not found.');

    const now = new Date();
    const lastBonus = user.lastBonusClaim || new Date(0);
    const hoursSince = (now - lastBonus) / (1000 * 60 * 60);

    if (hoursSince < 24) {
      return bot.sendMessage(chatId, '⏳ You can claim your next bonus in a few hours.');
    }

    user.coins += 5;
    user.lastBonusClaim = now;
    await user.save();

    const message = user.language === 'am'
      ? '🎉 ተጨማሪ ኮይኖች ተቀበሉ! (+5)'
      : '🎉 Bonus claimed! You earned +5 coins.';

    bot.sendMessage(chatId, message);
  });
};
