bot.onText(/\/confirm (\d+)\s+(.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const amount = match[1];
  const reference = match[2];

  // Save to database or notify admin
  bot.sendMessage(chatId, `✅ Received deposit confirmation:\nAmount: ${amount} birr\nReference: ${reference}\n\nPlease wait while we verify.`);
});
