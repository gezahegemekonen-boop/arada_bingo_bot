// commands/startgame.js
const Player = require('../models/Player');
const numberCaller = require('../utils/numberCaller');
const { generateCard } = require('../utils/cardGenerator'); 
const { endRound } = require('../game/roundManager');

module.exports = (bot) => {
  bot.onText(/\/startgame/, async (msg) => {
    const chatId = msg.chat.id;

    try {
      const players = await Player.find({ isApproved: true });

      if (players.length === 0) {
        return bot.sendMessage(chatId, '🚫 No approved players found.');
      }

      // Assign fresh Bingo cards to each player
      for (let player of players) {
        const newCard = generateCard(); // 5x5 Bingo card
        player.card = newCard;
        await player.save();

        const msgText = player.language === 'am'
          ? '🆕 አዲስ ቢንጎ ካርድ ተሰጠዎት።'
          : '🆕 A new Bingo card has been assigned to you.';

        bot.sendMessage(player.telegramId, msgText);
      }

      // Start number calling
      numberCaller.start(players, bot.sendMessage);

      // End round after 5 minutes (adjust time as needed)
      setTimeout(() => {
        endRound(players, bot);
      }, 5 * 60 * 1000);

      bot.sendMessage(chatId, '🎮 Bingo round started! Cards assigned and numbers will be called shortly.');
    } catch (err) {
      console.error('❌ Error starting game:', err);
      bot.sendMessage(chatId, '⚠️ Failed to start the game. Please try again later.');
    }
  });
};
