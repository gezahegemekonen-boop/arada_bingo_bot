export function setupPlayHandler(bot, gm) {
  bot.onText(/\/play/, async (msg) => {
    const chatId = msg.chat.id;

    try {
      await bot.sendMessage(chatId, '🎲 Generating your cartela...');

      const cartela = await gm.generateCartela(chatId); // or gm.startGame(chatId)

      if (!cartela) {
        await bot.sendMessage(chatId, '⚠️ Failed to generate cartela. Please try again.');
        return;
      }

      await bot.sendMessage(chatId, `🧩 Your cartela:\n${cartela}`);
    } catch (error) {
      console.error('Error in /play handler:', error);
      await bot.sendMessage(chatId, '🚫 An error occurred while starting the game. Please try again later.');
    }
  });
}
