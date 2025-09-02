// commands/player/withdraw.js

const Player = require('../../models/Player');
const Transaction = require('../../models/Transaction');

module.exports = (bot) => {
  bot.onText(/\/withdraw (\d+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id.toString();
    const amount = match && match[1] ? parseInt(match[1]) : 0;

    try {
      const player = await Player.findOne({ telegramId });

      if (!player || (player.wallet ?? 0) < amount) {
        const reply = player?.language === 'am'
          ? '❌ በቂ ቀሪ አልተገኘም።'
          : '❌ Insufficient balance.';
        return bot.sendMessage(chatId, reply);
      }

      // Save withdrawal request
      await Transaction.create({
        type: 'withdraw',
        amount,
        playerId: telegramId,
        approved: false,
      });

      // Confirmation message
      const reply = player.language === 'am'
        ? '📤 የመውጣት ጥያቄ ተላከ። እባክዎ አስተማማኝ እንዲያደርጉት ይጠብቁ።'
        : '📤 Withdrawal request submitted. Please wait for admin approval.';

      await bot.sendMessage(chatId, reply);

      // Ask for payout method
      const followUp = player.language === 'am'
        ? '📱 እባክዎ የመቀበል መንገድን ያስገቡ፦\n/receive <ስልክ ቁጥር> <መንገድ>\n\nምሳሌ፦ /receive 0920927761 Telebirr'
        : '📱 Please enter your payout method:\n/receive <phone number> <method>\n\nExample: /receive 0920927761 Telebirr';

      await bot.sendMessage(chatId, followUp);

    } catch (err) {
      console.error('❌ Error in /withdraw:', err);
      await bot.sendMessage(chatId, '⚠️ Something went wrong. Please try again later.');
    }
  });
};
