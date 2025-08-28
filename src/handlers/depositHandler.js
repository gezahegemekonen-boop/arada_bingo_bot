export function setupDepositHandler(bot, gm, adminId) {
  bot.onText(/\/deposit/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    await bot.sendMessage(chatId, '💳 How much would you like to deposit? Send a number.');

    bot.once('message', async (response) => {
      const amount = parseInt(response.text);
      if (isNaN(amount) || amount <= 0) {
        return bot.sendMessage(chatId, '❌ Invalid amount. Please try again.');
      }

      try {
        // Save deposit and update balance
        const tx = await gm.depositCoins(userId, amount); // You define this in GameManager

        await bot.sendMessage(chatId, `✅ Deposited ${amount} coins to your wallet.`);

        // Notify admin
        await bot.sendMessage(adminId, `📥 Deposit alert:\nUser: ${userId}\nAmount: ${amount} coins\nTransaction ID: ${tx?.id || 'N/A'}`);
      } catch (err) {
        console.error('Deposit error:', err);
        await bot.sendMessage(chatId, '🚫 Failed to process deposit. Please try again later.');
      }
    });
  });
}
