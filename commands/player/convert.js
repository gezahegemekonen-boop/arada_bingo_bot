// commands/player/convert.js
const Player = require('../../models/Player');

module.exports = (bot) => {
  bot.onText(/\/convert/, async (msg) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id.toString();

    try {
      const player = await Player.findOne({ telegramId });
      if (!player) {
        return bot.sendMessage(chatId, '🙈 Player not found.');
      }

      // Example conversion logic — replace with your real logic
      const coinsToAdd = 10; // Conversion amount
      player.coins = (player.coins || 0) + coinsToAdd;
      await player.save();

      const message = player.language === 'am'
        ? `✅ ቀሪ ባለው ተጫዋች ገንዘብ ${coinsToAdd} ኮይን ተጨመረ።`
        : `✅ Balance converted to ${coinsToAdd} coins.`;

      bot.sendMessage(chatId, message);
    } catch (err) {
      console.error('❌ Error in /convert:', err);
      bot.sendMessage(chatId, '⚠️ Something went wrong. Please try again later.');
    }
  });
};
