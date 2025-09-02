// commands/player/balance.js

const Player = require('../../models/Player');

module.exports = function (bot) {
  bot.onText(/\/balance/, async (msg) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id.toString();
    const lang = msg.from.language_code || 'en';

    try {
      const player = await Player.findOne({ telegramId });
      if (!player) {
        return bot.sendMessage(chatId, lang.startsWith('am') ? '🙈 ተጫዋች አልተገኘም።' : '🙈 Player not found.');
      }

      const wallet = player.wallet ?? 0;
      const coins = player.coins ?? 0;

      const message = lang.startsWith('am')
        ? `💰 ቀሪ: ${wallet} birr\n🎯 ኮይን: ${coins}`
        : `💰 Wallet: ${wallet} birr\n🎯 Coins: ${coins}`;

      await bot.sendMessage(chatId, message);
    } catch (err) {
      console.error('❌ Error in /balance:', err);
      await bot.sendMessage(chatId, '⚠️ Something went wrong while fetching your balance.');
    }
  });
};
