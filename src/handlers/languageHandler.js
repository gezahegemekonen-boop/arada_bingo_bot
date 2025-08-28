bot.onText(/\/language/, async (msg) => {
  const chatId = msg.chat.id;

  await bot.sendMessage(chatId, '🌐 Choose your language:\n1️⃣ English\n2️⃣ አማርኛ');

  bot.once('message', async (response) => {
    const choice = response.text.trim();

    if (choice === '1') {
      await gm.setLanguage(chatId, 'en'); // Save to DB or session
      await bot.sendMessage(chatId, '✅ Language set to English.');
    } else if (choice === '2') {
      await gm.setLanguage(chatId, 'am');
      await bot.sendMessage(chatId, '✅ ቋንቋ ወደ አማርኛ ተቀይሯል።');
    } else {
      await bot.sendMessage(chatId, '❌ Invalid choice. Please type 1 or 2.');
    }
  });
});
