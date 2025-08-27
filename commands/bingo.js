const { getRoomByPlayerId } = require('../utils/roomManager');
const validateCard = require('../utils/validateCard');
const notifyAdmin = require('../utils/notifyAdmin');

module.exports = async (ctx) => {
  const playerId = ctx.from.id.toString();
  const room = getRoomByPlayerId(playerId);

  if (!room || !room.isActive) {
    return ctx.reply('❌ No active Bingo round found.');
  }

  const player = room.players.find(p => p.telegramId === playerId);
  if (!player || !player.card) {
    return ctx.reply('🃏 You don’t have a Bingo card.');
  }

  if (player.hasWon) {
    return ctx.reply('🎉 You already claimed Bingo!');
  }

  const isValid = validateCard(player.card, room.caller.calledNumbers);
  if (!isValid) {
    const msg = player.language === 'am'
      ? '❌ የተሳሳተ ቢንጎ ነው። እባክዎን እንደገና ያረጋግጡ።'
      : '❌ Invalid Bingo. Please double-check your card.';
    return ctx.reply(msg);
  }

  player.hasWon = true;
  room.winners.push(player);

  const confirmMsg = player.language === 'am'
    ? '🎉 ቢንጎ አሸናፊ ነዎት! እባክዎን እንዲፈቀድ አስተዳዳሪን ያግኙ።'
    : '🎉 Bingo! You’re a winner. Awaiting admin approval.';
  ctx.reply(confirmMsg);

  notifyAdmin(player, room, ctx.telegram); // Notify admin for approval
};
