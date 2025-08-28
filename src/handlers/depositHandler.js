bot.onText(/\/deposit/, async (msg) => {
  const chatId = msg.chat.id;

  await bot.sendMessage(chatId, '💳 How much would you like to deposit? Send a number.');

  // Optional: Set up a listener for the next message
  bot.once('message', async (response) => {
    const amount = parseInt(response.text);
    if (isNaN(amount) || amount <= 0) {
      return bot.sendMessage(chatId, '❌ Invalid amount. Please try again.');
    }

    // Update balance in MongoDB
    await gm.depositCoins(chatId, amount); // You can define this in GameManager

    await bot.sendMessage(chatId, `✅ Deposited ${amount} coins to your wallet.`);
  });
});
