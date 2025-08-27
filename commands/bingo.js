module.exports = async function handleBingoCommand(ctx) {
  const playerId = ctx.from.id;
  const room = getRoomByPlayerId(playerId); // however you track rooms
  const player = room.players[playerId];
  const calledNumbers = room.numberCaller.getCalledNumbers();

  if (!player || !player.card) {
    return ctx.reply("❌ You don't have a card yet.");
  }

  if (isBingo(player.card.grid, calledNumbers)) {
    // ✅ Player wins!
    player.hasWon = true;
    room.winners.push(playerId);

    ctx.reply("🎉 Bingo! You won!", { reply_to_message_id: ctx.message.message_id });

    // Optional: trigger payout, log win, notify admin
  } else {
    ctx.reply("😢 No Bingo yet. Keep trying!", { reply_to_message_id: ctx.message.message_id });
  }
};
