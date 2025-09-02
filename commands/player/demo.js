// commands/player/demo.js

module.exports = (bot) => {
  bot.onText(/\/demo/, async (msg) => {
    bot.sendMessage(msg.chat.id, '🧪 Demo mode activated. This is a test environment.');
  });
};
