// bot.js
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');

// 🚀 Initialize bot
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// 🌐 Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ⚡ Helper to load commands safely
const loadCommands = (commands) => {
  commands.forEach((cmdPath) => {
    try {
      const command = require(cmdPath);
      if (typeof command === 'function') {
        command(bot);
      } else {
        console.warn(`⚠️ Command at ${cmdPath} is not a function.`);
      }
    } catch (err) {
      console.error(`❌ Failed to load ${cmdPath}:`, err);
    }
  });
};

// 🧩 Player Commands
loadCommands([
  './commands/player/start',
  './commands/player/instruction',
  './commands/player/deposit',
  './commands/player/convert',  // Fixed convert.js
  './commands/player/play',
  './commands/player/balance',
  './commands/player/withdraw',
  './commands/player/transaction',
  './commands/player/language',
  './commands/player/invite',
  './commands/player/referrals',
  './commands/player/leaderboard',
  './commands/player/bonus',
  './commands/player/demo',
]);

// 🛠️ Admin Commands
loadCommands([
  './commands/admin/approve',
  './commands/admin/reject',
  './commands/admin/pending',
]);

// ✅ Health check
bot.onText(/\/health/, (msg) => {
  bot.sendMessage(msg.chat.id, '✅ Bot is alive and running.');
});

// 🧠 Fallback for unknown messages
bot.on('message', (msg) => {
  if (!msg.text.startsWith('/')) {
    bot.sendMessage(msg.chat.id, '🤖 Please use a command like /instruction or /play to get started.');
  }
});

console.log('✅ Telegram Bingo bot is live and polling for commands');

module.exports = bot; // Export bot if needed elsewhere
