const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// 🎮 Player Commands
require('./commands/player/help')(bot);
require('./commands/player/transaction')(bot);
require('./commands/player/balance')(bot);
require('./commands/player/language')(bot);

// 💵 Payment Commands
require('./commands/deposit')(bot);
require('./commands/confirm')(bot);
require('./commands/withdraw')(bot);
require('./commands/account')(bot);

// Optional: log startup
console.log('🤖 Bingo bot is running...');
