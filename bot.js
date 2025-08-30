require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// 🌐 Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// 🧩 Player Commands
require('./commands/player/start')(bot);         // Handles /start + referral
require('./commands/player/instruction')(bot);   // Bilingual game guide
require('./commands/player/deposit')(bot);       // Deposit with location + referral bonus
require('./commands/player/convert')(bot);       // Convert balance to coins
require('./commands/player/play')(bot);          // Start Bingo
require('./commands/player/balance')(bot);       // Show wallet + coins
require('./commands/player/withdraw')(bot);      // Cash out
require('./commands/player/transaction')(bot);   // View history
require('./commands/player/language')(bot);      // Switch language
require('./commands/player/invite')(bot);        // Referral system
require('./commands/player/demo')(bot);          // Optional demo mode

// 🛠️ Admin Commands
require('./commands/admin/approve')(bot);        // Approve deposits
require('./commands/admin/reject')(bot);         // Reject deposits
require('./commands/admin/pending')(bot);        // View pending list

// 🧠 Fallback for unknown messages
bot.on('message', (msg) => {
  if (!msg.text.startsWith('/')) {
    bot.sendMessage(msg.chat.id, '🤖 Please use a command like /instruction or /play to get started.');
  }
});
