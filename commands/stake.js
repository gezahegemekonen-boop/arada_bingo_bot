bot.command('stake', async (ctx) => {
  const amount = parseInt(ctx.message.text.split(' ')[1]);
  const validStakes = [10, 20, 30, 50, 100];
  if (!validStakes.includes(amount)) return ctx.reply('❌ Invalid stake.');

  const player = await Player.findOne({ telegramId: ctx.from.id.toString() });
  if (!player || player.balance < amount) return ctx.reply('❌ Insufficient balance.');

  player.balance -= amount;
  player.currentStake = amount;
  await player.save();

  await RoomManager.addPlayerToRoom(player, amount); // handles room logic
  ctx.reply(`✅ You joined the ${amount} ETB room. Waiting for others...`);
});
