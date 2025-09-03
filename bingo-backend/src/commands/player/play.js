module.exports = (bot) => {
  bot.onText(/\/play/, async (msg) => {
    bot.sendMessage(msg.chat.id, '🎮 Bingo play will start soon!');
  });
};
