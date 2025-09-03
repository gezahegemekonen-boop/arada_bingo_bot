const User = require('../../models/User');

module.exports = (bot) => {
  bot.onText(/\/bonus/, async (msg) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id.toString();

    const user = await User.findOne({ telegramId });
    if (!user) return bot.sendMessage(chatId, '🙈 Player not found.');

    const now = new Date();
    const last = user.lastBonusClaim || new Date(0);
    if ((now - last) < 24 * 60 * 60 * 1000) {
      return bot.sendMessage(chatId, '⏳ You can claim bonus once every 24h.');
    }

    user.coins += 5;
    user.lastBonusClaim = now;
    await user.save();
    bot.sendMessage(chatId, '🎉 Bonus claimed! You earned +5 coins.');
  });
};
