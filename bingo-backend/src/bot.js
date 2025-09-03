require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');

// 🔹 Initialize Telegram bot
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// 🌐 Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// --------------------
// 🧩 Player Commands
// --------------------
require('./commands/player/start')(bot);
require('./commands/player/instruction')(bot);
require('./commands/player/deposit')(bot);
require('./commands/player/convert')(bot);
require('./commands/player/play')(bot);
require('./commands/player/balance')(bot);
require('./commands/player/withdraw')(bot);
require('./commands/player/transaction')(bot);
require('./commands/player/language')(bot);
require('./commands/player/invite')(bot);
require('./commands/player/referrals')(bot);
require('./commands/player/leaderboard')(bot);
require('./commands/player/bonus')(bot);
require('./commands/player/demo')(bot);

// --------------------
// 🛠️ Admin Commands
// --------------------
require('./commands/admin/approve')(bot);
require('./commands/admin/reject')(bot);
require('./commands/admin/pending')(bot);

// --------------------
// ✅ Health check
// --------------------
bot.onText(/\/health/, (msg) => {
  bot.sendMessage(msg.chat.id, '✅ Bot is alive and running.');
});

// --------------------
// 🧠 Fallback for unknown messages
// --------------------
bot.on('message', (msg) => {
  if (!msg.text.startsWith('/')) {
    bot.sendMessage(msg.chat.id, '🤖 Please use a command like /instruction or /play to get started.');
  }
});

// 🚀 Startup confirmation
console.log('✅ Telegram Bingo bot is live and polling for commands');

module.exports = bot;
