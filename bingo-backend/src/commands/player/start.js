const Player = require('../../models/Player');
const User = require('../../models/User');

module.exports = (bot) => {
  bot.onText(/\/start(?:\s+(\d+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id.toString();
    const refId = match ? match[1] : null;

    let player = await Player.findOne({ telegramId });
    if (!player) {
      player = new Player({ telegramId });
      if (refId && refId !== telegramId) player.referredBy = refId;
      await player.save();
    }

    let user = await User.findOne({ telegramId });
    if (!user) {
      user = new User({ telegramId });
      if (refId && refId !== telegramId) user.referredBy = refId;
      await user.save();
    }

    const lang = player.language || 'en';
    const message = lang === 'am'
      ? '👋 እንኳን ወደ Arada Bingo በደህና መጡ!'
      : '👋 Welcome to Arada Bingo!';
    
    bot.sendMessage(chatId, message);
  });
};
