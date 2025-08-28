import { setupDepositHandler } from './handlers/depositHandler.js';
import { setupLanguageHandler } from './handlers/languageHandler.js';

export function setupHandlers({ bot, gm, adminId }) {
  // --- /play command ---
  bot.onText(/\/play/, async (msg) => {
    const chatId = msg.chat.id;

    try {
      await bot.sendMessage(chatId, '🎲 Generating your cartela...');

      // Generate cartela or start game logic
      const cartela = await gm.generateCartela(chatId); // or gm.startGame(chatId)

      if (!cartela) {
        await bot.sendMessage(chatId, '⚠️ Failed to generate cartela. Please try again.');
        return;
      }

      await bot.sendMessage(chatId, `🧩 Your cartela:\n${cartela}`);
    } catch (error) {
      console.error('Error in /play handler:', error);
      await bot.sendMessage(chatId, '🚫 An error occurred while starting the game. Please contact support or try again later.');
    }
  });

  // --- Future commands ---
  setupDepositHandler(bot, gm, adminId);
  setupLanguageHandler(bot, gm);
}
