// commands/bingo.js

const { isBingo } = require('../utils/bingoValidator');

module.exports = async function handleBingoCommand(ctx) {
  const playerId = ctx.from.id;
  const room = getRoomByPlayerId(playerId); // Replace with your actual room lookup
  if (!room) return ctx.reply("❌ You are not in a game room.");

  const player = room.players[playerId];
  if (!player || !player.card) {
    return ctx.reply("❌ You don't have a Bingo card yet.");
  }

  if (player.hasWon) {
    return ctx.reply("✅ You've already won this round!");
  }

  const calledNumbers = room.numberCaller.getCalledNumbers();

  if (isBingo(player.card.grid, calledNumbers)) {
    player.hasWon = true;
    room.winners.push(playerId);

    const winMessage = `🎉 Bingo! You won!\n\n🏆 ቢንጎ! አሸንፈህ!`;
    ctx.reply(winMessage, { reply_to_message_id: ctx.message.message_id });

    // Optional: Notify admin or trigger payout
    // notifyAdmin(playerId, room.id);
    // triggerPayment(playerId);

  } else {
    const missMessage = `😢 No Bingo yet. Try again!\n\n⏳ አሁን ጊዜ አይደለም። እንደገና ሞክር!`;
    ctx.reply(missMessage, { reply_to_message_id: ctx.message.message_id });
  }
};
