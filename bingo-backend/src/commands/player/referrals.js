const User = require('../../models/User');

module.exports = (bot) => {
  bot.onText(/\/referrals/, async (msg) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id.toString();

    const referrals = await User.find({ referredBy: telegramId });
    bot.sendMessage(chatId, `👥 Total referrals: ${referrals.length}`);
  });
};
