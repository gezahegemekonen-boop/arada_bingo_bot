const Player = require('../../models/Player');

module.exports = function(bot) {
  bot.onText(/\/language/, async (msg) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id.toString();

    const player = await Player.findOne({ telegramId });
    if (!player) return bot.sendMessage(chatId, 'Player not found.');

    player.language = player.language === 'am' ? 'en' : 'am';
    await player.save();

    bot.sendMessage(chatId, player.language === 'am' ? '✅ ቋንቋ ወደ አማርኛ ተቀየረ።' : '✅ Language switched to English.');
  });
};
