// commands/startgame.js
const Player = require('../models/Player');
const numberCaller = require('../utils/numberCaller');
const { generateCard } = require('../utils/cardGenerator'); // You’ll need this
const bot = require('../bot');
const { endRound } = require('../game/roundManager');

bot.command('startgame', async (ctx) => {
  const players = await Player.find({ isApproved: true }); // Or however you filter active players

  if (players.length === 0) {
    return ctx.reply('🚫 No approved players found.');
  }

  // Assign fresh cards to each player
  for (let player of players) {
    const newCard = generateCard(); // 5x5 Bingo card
    player.card = newCard;
    await player.save();

    const msg = player.language === 'am'
      ? '🆕 አዲስ ቢንጎ ካርድ ተሰጠዎት።'
      : '🆕 A new Bingo card has been assigned to you.';
    bot.sendMessage(player.telegramId, msg);
  }

  // Start number calling
  numberCaller.start(players, bot.sendMessage);

  // End round after 5 minutes (adjust as needed)
  setTimeout(() => {
    endRound(players);
  }, 5 * 60 * 1000);
});
