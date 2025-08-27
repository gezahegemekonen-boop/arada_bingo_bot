bot.onText(/\/deposit (\d+)/, async (msg, match) => {
  const amount = parseInt(match[1]);
  const telegramId = msg.from.id.toString();

  await Transaction.create({
    type: 'deposit',
    amount,
    playerId: telegramId,
    approved: false
  });

  const reply = msg.from.language === 'am'
    ? `📥 የተቀመጠ ጥያቄ። እባክዎ አስተማማኝ እንዲያደርጉት ይጠብቁ።`
    : `📥 Deposit request submitted. Please wait for admin approval.`;

  bot.sendMessage(telegramId, reply);
});
