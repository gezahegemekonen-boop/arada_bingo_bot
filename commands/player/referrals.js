const User = require('../../models/User');

module.exports = function(bot) {
  bot.onText(/\/referrals/, async (msg) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id.toString();
    const user = await User.findOne({ telegramId });
    if (!user) return bot.sendMessage(chatId, '🙈 Player not found.');

    const referrals = await User.find({ referredBy: telegramId });
    bot.sendMessage(chatId, `👥 Total referrals: ${referrals.length}`);
  });
};
