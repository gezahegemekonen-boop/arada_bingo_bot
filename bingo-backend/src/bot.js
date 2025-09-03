require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Load Player commands
const playerCommands = [
  'start','instruction','deposit','convert','play','balance',
  'withdraw','transaction','language','invite','referrals',
  'leaderboard','bonus','demo'
];

playerCommands.forEach(cmd => require(`./commands/player/${cmd}`)(bot));

// Load Admin commands
const adminCommands = ['approve','reject','pending'];
adminCommands.forEach(cmd => require(`./commands/admin/${cmd}`)(bot));

// Health check
bot.onText(/\/health/, (msg) => {
  bot.sendMessage(msg.chat.id, '✅ Bot is alive and running.');
});

// Fallback for unknown messages
bot.on('message', (msg) => {
  if (!msg.text.startsWith('/')) {
    bot.sendMessage(msg.chat.id, '🤖 Please use a command like /instruction or /play to get started.');
  }
});

console.log('✅ Telegram Bingo bot is live and polling for commands');

module.exports = bot;
