bot.onText(/\/approve (\w+)/, async (msg, match) => {
  const txId = match[1];
  const adminId = msg.from.id.toString();

  if (adminId !== process.env.ADMIN_ID) {
    return bot.sendMessage(msg.chat.id, '❌ Unauthorized.');
  }

  const tx = await Transaction.findById(txId);
  if (!tx || tx.approved) {
    return bot.sendMessage(msg.chat.id, '⚠️ Invalid or already approved.');
  }

  const player = await Player.findOne({ telegramId: tx.playerId });
  if (!player) return;

  if (tx.type === 'deposit') {
    player.balance += tx.amount;
  } else if (tx.type === 'withdraw') {
    player.balance -= tx.amount;
  }

  tx.approved = true;
  await tx.save();
  await player.save();

  const reply = player.language === 'am'
    ? `✅ እባክዎ ጥያቄው ተፈቅዷል። ቀሪ አዘምኗል።`
    : `✅ Your request has been approved. Balance updated.`;

  bot.sendMessage(player.telegramId, reply);
  bot.sendMessage(adminId, `👍 Approved transaction ${txId}.`);
});
