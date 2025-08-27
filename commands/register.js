bot.command('register', async (ctx) => {
  const telegramId = ctx.from.id.toString();
  const exists = await Player.findOne({ telegramId });

  if (exists) return ctx.reply('✅ You are already registered.');

  const newPlayer = new Player({
    telegramId,
    balance: 10,
    language: 'en', // or detect from profile
    isApproved: true
  });

  await newPlayer.save();
  ctx.reply('🎁 Welcome! You’ve received a free 10 ETB card to start playing.');
});
