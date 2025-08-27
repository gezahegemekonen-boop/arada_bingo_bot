bot.onText(/\/withdraw (\d+)/, async (msg, match) => {
  const amount = parseInt(match[1]);
  const telegramId = msg.from.id.toString();
  const player = await Player.findOne({ telegramId });

  if (!player || player.balance < amount) {
    const reply = player.language === 'am'
      ? '❌ በቂ ቀሪ አልተገኘም።'
      : '❌ Insufficient balance.';
    return bot.sendMessage(telegramId, reply);
  }

  await Transaction.create({
    type: 'withdraw',
    amount,
    playerId: telegramId,
    approved: false
  });

  const reply = player.language === 'am'
    ? '📤 የመውጣት ጥያቄ ተላከ። እባክዎ አስተማማኝ እንዲያደርጉት ይጠብቁ።'
    : '📤 Withdrawal request submitted. Please wait for admin approval.';

  bot.sendMessage(telegramId, reply);
});
