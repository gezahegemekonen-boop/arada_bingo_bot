// game/startRound.js
const numberCaller = require('../utils/numberCaller');
const bot = require('../bot'); // your Telegram bot instance

function startGameRound(players) {
  numberCaller.start((number) => {
    players.forEach(player => {
      bot.sendMessage(player.telegramId, `🎱 Number called: ${number}`);
    });

    // You can also check for winners here
  });

  // Optional: Stop after 50 numbers or after 2 minutes
  setTimeout(() => {
    numberCaller.stop();
    bot.sendMessage(players[0].telegramId, '⏱️ Round ended!');
  }, 120000); // 2 minutes
}

module.exports = startGameRound;
