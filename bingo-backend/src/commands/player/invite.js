const User = require('../../models/User');

module.exports = (bot) => {
  bot.onText(/\/invite/, async (msg) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id.toString();

    const referralLink = `https://t.me/${process.env.BOT_USERNAME}?start=${telegramId}`;
    bot.sendMessage(chatId, `🎉 Invite friends and earn coins!\n🔗 Link: ${referralLink}`);
  });
};
