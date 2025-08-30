const Player = require('../../models/Player');

module.exports = function(bot) {
  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id.toString();
    const langCode = msg.from.language_code || 'en';
    const language = langCode.startsWith('am') ? 'am' : 'en';

    let player = await Player.findOne({ telegramId });

    if (!player) {
      player = new Player({
        telegramId,
        balance: 10, // 🎁 First-time bonus
        coins: 0,
        language,
      });
      await player.save();
    }

    const message = language === 'am'
      ? `👋 እንኳን ደህና መጣህ ቢንጎ ቦት ወደ! 🎉\n\nየመጀመሪያ ብድሃት 10 birr ተሰጥቷል።\n/play በመስጠት ጨዋታ ጀምር።`
      : `👋 Welcome to the Bingo Bot! 🎉\n\nYou've received a 10 birr starting bonus.\nType /play to begin your first game.`;

    bot.sendMessage(chatId, message);
  });
};
