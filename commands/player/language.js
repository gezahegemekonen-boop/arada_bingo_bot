// commands/player/language.js

const Player = require('../../models/Player');

module.exports = function (bot) {
  bot.onText(/\/language/, async (msg) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id.toString();

    try {
      const player = await Player.findOne({ telegramId });
      if (!player) {
        return bot.sendMessage(chatId, '❌ Player not found.');
      }

      const newLang = player.language === 'am' ? 'en' : 'am';
      player.language = newLang;
      await player.save();

      const message = newLang === 'am'
        ? '✅ ቋንቋ ወደ አማርኛ ተቀየረ።'
        : '✅ Language switched to English.';

      await bot.sendMessage(chatId, message);
    } catch (err) {
      console.error('❌ Error in /language:', err);
      await bot.sendMessage(chatId, '⚠️ Something went wrong while switching language.');
    }
  });
};
