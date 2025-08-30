bot.onText(/\/deposit (\d+)/, async (msg, match) => {
  const amount = parseInt(match[1]);
  const telegramId = msg.from.id.toString();
  const language = msg.from.language_code || 'en'; // fallback to English

  // Save deposit request to DB
  await Transaction.create({
    type: 'deposit',
    amount,
    playerId: telegramId,
    approved: false
  });

  // Confirmation message
  const reply = language.startsWith('am')
    ? `📥 የተቀመጠ ጥያቄ። እባክዎ አስተማማኝ እንዲያደርጉት ይጠብቁ።`
    : `📥 Deposit request submitted. Please wait for admin approval.`;

  await bot.sendMessage(telegramId, reply);

  // Payment instructions
  const instructions = getPaymentInstructions(language);
  await bot.sendMessage(telegramId, instructions);
});
