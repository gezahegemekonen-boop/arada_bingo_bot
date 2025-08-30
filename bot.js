const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// 🎮 Player Commands
require('./commands/player/start')(bot);         // Auto-create player + welcome
require('./commands/player/help')(bot);          // Show bilingual menu
require('./commands/player/balance')(bot);       // Show wallet + coins
require('./commands/player/language')(bot);      // Toggle Amharic/English
require('./commands/player/transaction')(bot);   // Show deposit/withdraw history

// 💵 Payment Commands
require('./commands/deposit')(bot);              // Handle deposits
require('./commands/confirm')(bot);              // Admin confirms deposits
require('./commands/withdraw')(bot);             // Handle withdrawals
require('./commands/account')(bot);              // Show account info

// Optional: log startup
console.log('🤖 Bingo bot is running...');
