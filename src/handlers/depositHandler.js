// src/handlers/depositHandler.js
import Transaction from '../models/Transaction.js';
import Player from '../models/Player.js';

export function setupDepositHandler(bot, gm, adminId) {
  // 💰 /deposit <amount>
  bot.onText(/\/deposit (\d+)/, async (msg, match) => {
    const amount = parseInt(match[1]);
    const telegramId = msg.from.id.toString();

    try {
      let player = await Player.findOne({ telegramId });
      if (!player) {
        player = new Player({ telegramId, balance: 0 });
        await player.save();
      }

      const tx = new Transaction({
        type: 'deposit',
        playerId: telegramId,
        amount,
        status: 'pending',
        requestedAt: new Date()
      });

      await tx.save();

      await bot.sendMessage(msg.chat.id, `💰 Deposit of ${amount} ETB received.\nAwaiting admin approval.\nTransaction ID: \`${tx._id}\``, {
        parse_mode: 'Markdown'
      });

      await bot.sendMessage(adminId, `📥 New deposit request:\nPlayer: ${telegramId}\nAmount: ${amount} ETB\nTxID: ${tx._id}`);
    } catch (error) {
      console.error('Deposit error:', error);
      await bot.sendMessage(msg.chat.id, '🚫 Failed to process deposit. Please try again.');
    }
  });

  // 📊 /status
  bot.onText(/\/status/, async (msg) => {
    const telegramId = msg.from.id.toString();

    try {
      const player = await Player.findOne({ telegramId });
      if (!player) {
        return bot.sendMessage(msg.chat.id, '❌ No account found. Please make a deposit first.');
      }

      const txs = await Transaction.find({ playerId: telegramId }).sort({ createdAt: -1 }).limit(3);

      const statusText = `
🧾 Balance: ${player.balance} ETB
📄 Recent Transactions:
${txs.map(tx => `• ${tx.amount} ETB – ${tx.status === 'approved' ? '✅ Approved' : tx.status === 'rejected' ? '❌ Rejected' : '⏳ Pending'} (ID: ${tx._id})`).join('\n')}
      `;

      await bot.sendMessage(msg.chat.id, statusText);
    } catch (error) {
      console.error('Status error:', error);
      await bot.sendMessage(msg.chat.id, '🚫 Failed to fetch status. Try again later.');
    }
  });
}
