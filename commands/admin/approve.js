// commands/admin/approve.js

module.exports = (bot) => {
  bot.onText(/\/approve (\w+)/, async (msg, match) => {
    const txId = match[1];
    bot.sendMessage(msg.chat.id, `✅ Transaction ${txId} approved (placeholder).`);
  });
};
