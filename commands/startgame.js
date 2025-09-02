// commands/player/startgame.js

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

      // Assign fresh cards to each player
      for (let player of players) {
        const newCard = generateCard(); // 5x5 Bingo card
        player.card = newCard;
        await player.save();

        const msgText = player.language === 'am'
          ? '🆕 አዲስ ቢንጎ ካርድ ተሰጠዎት።'
          : '🆕 A new Bingo card has been assigned to you.';

        await bot.sendMessage(player.telegramId, msgText);
      }

      // Start number calling
      numberCaller.start(players, bot.sendMessage);

      // End round after 5 minutes (adjust as needed)
      setTimeout(() => {
        endRound(players);
      }, 5 * 60 * 1000);

      // Notify the admin or starter
      await bot.sendMessage(chatId, '🎲 Bingo game started!');
    } catch (err) {
      console.error('❌ Error starting game:', err);
      await bot.sendMessage(chatId, '⚠️ Something went wrong while starting the game.');
    }
  });
};
