const { isBingo } = require('../utils/bingoValidator');
const { getRoomByPlayerId } = require('../utils/roomManager');
const { triggerPayment } = require('../utils/payment'); // ✅ Import here

module.exports = async function handleBingoCommand(ctx) {
  const playerId = ctx.from.id.toString();
  const room = getRoomByPlayerId(playerId);
  if (!room) return ctx.reply("❌ You are not in a game room.");

  const player = room.players[playerId];
  if (!player || !player.card) {
    return ctx.reply("❌ You don't have a Bingo card yet.");
  }

  if (player.hasWon) {
    return ctx.reply("✅ You've already won this round.");
  }

  const calledNumbers = room.numberCaller.getCalledNumbers();

  if (isBingo(player.card.grid, calledNumbers)) {
    player.hasWon = true;
    room.winners.push(playerId);

    const winMessage = player.language === 'am'
      ? '🎉 ቢንጎ! አሸንፈህ! እንኳን ደስ አለዎት!'
      : '🎉 Bingo! You won! Congratulations!';
    ctx.reply(winMessage);

    // ✅ Trigger payment here
    await triggerPayment(playerId, room.prizeAmount);

    // Optional: notify other players, end round, log win
  } else {
    const missMessage = player.language === 'am'
      ? '⏳ አሁን ጊዜ አይደለም። ቢንጎ አልተሳካም።'
      : '⏳ Not yet. That’s not a valid Bingo.';
    ctx.reply(missMessage);
  }
};
