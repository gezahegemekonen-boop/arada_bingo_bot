// game/roundManager.js
const numberCaller = require('../utils/numberCaller');
const { startNewRound } = require('./gameStarter'); // adjust path if needed
const bot = require('../bot'); // your Telegram bot instance

function endRound(players) {
  numberCaller.stop();

  players.forEach(p => {
    const msg = p.language === 'am'
      ? '⏱️ ዙሩ አልቋል።'
      : '⏱️ Round ended.';
    bot.sendMessage(p.telegramId, msg);
  });

  setTimeout(() => {
    startNewRound(players); // assign new cards, reset state
  }, 10000); // 10-second break
}

module.exports = { endRound };
