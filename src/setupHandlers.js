bot.onText(/\/play/, async (msg) => {
  const chatId = msg.chat.id;

  await bot.sendMessage(chatId, '🎲 Generating your cartela...');

  // Example: Call your cartela generator
  const cartela = await gm.generateCartela(chatId); // or gm.startGame(chatId)

  await bot.sendMessage(chatId, `🧩 Your cartela:\n${cartela}`);
});
