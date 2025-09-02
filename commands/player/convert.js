// commands/player/convert.js

module.exports = async (ctx) => {
  const userId = ctx.from.id;

  // Placeholder logic — replace with real DB lookup and update
  const coinsToAdd = 10; // Example conversion rate

  // Simulate conversion
  await ctx.reply(`✅ Balance converted to ${coinsToAdd} coins for user ${userId}.`);
};
