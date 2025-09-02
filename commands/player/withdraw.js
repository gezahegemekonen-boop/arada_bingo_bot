// commands/player/withdraw.js

const Player = require('../../models/Player');         // Adjust path if needed
const Transaction = require('../../models/Transaction'); // Adjust path if needed

module.exports = (bot) => {
  bot.onText(/\/withdraw (\d+)/, async (msg, match) => {
    const amount = parseInt(match[1]);
    const telegramId = msg.from.id.toString();

    try {
      const player = await Player.findOne({ telegramId });

      if (!player || player.balance < amount) {
        const reply = player?.language === 'am'
          ? '❌ በቂ ቀሪ አልተገኘም።'
          : '❌ Insufficient balance.';
        return bot.sendMessage(telegramId, reply);
      }

      // Save withdrawal request
      await Transaction.create({
        type: 'withdraw',
        amount,
        playerId: telegramId,
        approved: false
      });

      // Confirmation message
      const reply = player.language === 'am'
        ? '📤 የመውጣት ጥያቄ ተላከ። እባክዎ አስተማማኝ እንዲያደርጉት ይጠብቁ።'
        : '📤 Withdrawal request submitted. Please wait for admin approval.';

      await bot.sendMessage(telegramId, reply);

      // Ask for payout method
      const followUp = player.language === 'am'
        ? '📱 እባክዎ የመቀበል መንገድን ያስገቡ፦\n/receive <ስልክ ቁጥር> <መንገድ>\n\nምሳሌ፦ /receive 0920927761 Telebirr'
        : '📱 Please enter your payout method:\n/receive <phone number> <method>\n\nExample: /receive 0920927761 Telebirr';

      await bot.sendMessage(telegramId, followUp);
    } catch (err) {
      console.error('❌ Error in /withdraw:', err);
      bot.sendMessage(telegramId, '⚠️ Something went wrong. Please try again later.');
    }
  });
};
