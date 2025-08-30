const Player = require('../../models/Player');

module.exports = function(bot) {
  bot.onText(/\/balance/, async (msg) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id.toString();
    const lang = msg.from.language_code || 'en';

    const player = await Player.findOne({ telegramId });
    if (!player) {
      return bot.sendMessage(chatId, lang.startsWith('am') ? '🙈 ተጫዋች አልተገኘም።' : '🙈 Player not found.');
    }

    const message = lang.startsWith('am')
      ? `💰 ቀሪ: ${player.wallet} birr\n🎯 ኮይን: ${player.coins}`
      : `💰 Wallet: ${player.wallet} birr\n🎯 Coins: ${player.coins}`;

    bot.sendMessage(chatId, message);
  });
};
