const Player = require('../../models/Player');

module.exports = function(bot) {
  bot.onText(/\/language/, async (msg) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id.toString();

    const player = await Player.findOne({ telegramId });
    if (!player) {
      return bot.sendMessage(chatId, 'Player not found.');
    }

    const newLang = player.language === 'am' ? 'en' : 'am';
    player.language = newLang;
    await player.save();

    const message = newLang === 'am'
      ? '✅ ቋንቋ ወደ አማርኛ ተቀየረ።'
      : '✅ Language switched to English.';

    bot.sendMessage(chatId, message);
  });
};
