// commands/player/demo.js

module.exports = function (bot) {
  bot.onText(/\/demo/, async (msg) => {
    try {
      await bot.sendMessage(msg.chat.id, '🧪 Demo mode activated. This is a test environment.');
    } catch (err) {
      console.error('❌ Error in /demo:', err);
    }
  });
};
