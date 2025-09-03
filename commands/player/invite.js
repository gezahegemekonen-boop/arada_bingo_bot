const User = require('../../models/User');

module.exports = function(bot) {
  bot.onText(/\/invite/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    let user = await User.findOne({ telegramId: userId });
    if (!user) {
      user = new User({ telegramId: userId });
      await user.save();
    }

    const referralLink = `https://t.me/${process.env.BOT_USERNAME}?start=${userId}`;
    bot.sendMessage(chatId, `🎉 Invite friends!\n🔗 ${referralLink}`);
  });
};
