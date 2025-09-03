module.exports = (bot) => {
  bot.onText(/\/demo/, (msg) => {
    bot.sendMessage(msg.chat.id, '🧪 Demo mode activated. This is a test environment.');
  });
};
