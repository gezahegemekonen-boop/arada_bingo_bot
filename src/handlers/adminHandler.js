// src/handlers/adminHandler.js
import Player from '../models/Player.js';
import Transaction from '../models/Transaction.js';
import renderCard from '../utils/renderCard.js';

export function setupAdminHandler(bot, gm, adminId) {
  // ✅ Approve transaction
  bot.onText(/\/approve (\w+)/, async (msg, match) => {
    const txId = match[1];
    const senderId = msg.from.id.toString();

    if (senderId !== adminId) {
      return bot.sendMessage(msg.chat.id, '❌ You are not authorized.');
    }

    const tx = await Transaction.findById(txId);
    if (!tx || tx.approved) {
      return bot.sendMessage(msg.chat.id, '⚠️ Transaction not found or already approved.');
    }

    tx.approved = true;
    await tx.save();

    const player = await Player.findById(tx.playerId);
    player.balance += tx.amount;
    await player.save();

    bot.sendMessage(player.telegramId, `✅ Your deposit of ${tx.amount} has been approved.`);
    bot.sendMessage(msg.chat.id, `👍 Approved transaction ${txId}.`);
  });

  // 🎯 Send Bingo card image
  bot.onText(/\/sendcard (\d+)/, async (msg, match) => {
    const targetId = match[1];
    const senderId = msg.from.id.toString();

    if (senderId !== adminId) {
      return bot.sendMessage(msg.chat.id, '❌ You are not authorized.');
    }

    const card = Array.from({ length: 25 }, (_, i) => i + 1); // sample card
    const image = renderCard(card);

    bot.sendPhoto(targetId, image, { caption: '🎯 Your Bingo card' });
  });
}
