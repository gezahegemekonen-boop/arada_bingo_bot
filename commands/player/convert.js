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

      // Example conversion logic
      const coinsToAdd = 10; // Replace with real conversion logic
      player.coins += coinsToAdd;
      await player.save();

      bot.sendMessage(chatId, `✅ Balance converted to ${coinsToAdd} coins for user ${telegramId}.`);
    } catch (err) {
      console.error('❌ Error in /convert:', err);
      bot.sendMessage(chatId, '⚠️ Something went wrong. Please try again later.');
    }
  });
};
