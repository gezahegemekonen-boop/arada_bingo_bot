import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import handlePendingDeposits from './commands/pendingDeposits.js';
import handlePendingPayouts from './commands/pendingPayouts.js';
import handleCallback from './commands/callbackHandler.js';

dotenv.config();
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.onText(/\/pending_deposits/, (msg) => {
  handlePendingDeposits(bot, msg.chat.id);
});

bot.onText(/\/pending_payouts/, (msg) => {
  handlePendingPayouts(bot, msg.chat.id);
});

bot.on('callback_query', (query) => {
  handleCallback(bot, query);
});

