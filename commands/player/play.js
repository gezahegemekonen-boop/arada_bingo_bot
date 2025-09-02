// commands/player/play.js

module.exports = (bot) => {
  bot.onText(/\/play/, async (msg) => {
    bot.sendMessage(msg.chat.id, '🎮 Bingo play logic coming soon!');
  });
};
