// bot.js
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Initialize bot
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// 🌐 Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// 🧩 Helper function to load commands dynamically
function loadCommands(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      loadCommands(fullPath); // Recursively load subdirectories
    } else if (file.endsWith('.js')) {
      try {
        require(fullPath)(bot);
        console.log(`🟢 Loaded command: ${fullPath}`);
      } catch (err) {
        console.error(`❌ Failed to load ${fullPath}:`, err);
      }
    }
  });
}

// Load player and admin commands
loadCommands(path.join(__dirname, 'commands'));

// ✅ Health check command
bot.onText(/\/health/, async (msg) => {
  try {
    await bot.sendMessage(msg.chat.id, '✅ Bot is alive and running.');
  } catch (err) {
    console.error('❌ Error sending health message:', err);
  }
});

// 🧠 Fallback for unknown messages
bot.on('message', async (msg) => {
  try {
    if (!msg.text.startsWith('/')) {
      await bot.sendMessage(msg.chat.id, '🤖 Please use a command like /instruction or /play to get started.');
    }
  } catch (err) {
    console.error('❌ Error in fallback message:', err);
  }
});

// 🚀 Startup confirmation
console.log('✅ Telegram Bingo bot is live and polling for commands');

module.exports = bot;
