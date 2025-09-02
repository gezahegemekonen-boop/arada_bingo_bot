import dotenv from 'dotenv';
dotenv.config();

import TelegramBot from 'node-telegram-bot-api';
import handlePendingDeposits from './commands/pendingDeposits.js';
import handlePendingPayouts from './commands/pendingPayouts.js';
import handleCallback from './commands/callbackHandler.js';
import handleStats from './commands/stats.js';
import handleApprove from './commands/approve.js';
import handleReject from './commands/reject.js';
import { isAdmin } from './utils/auth.js';

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// 🔐 Admin-only commands
bot.onText(/\/pending_deposits/, (msg) => {
  if (!isAdmin(msg.chat.id)) return bot.sendMessage(msg.chat.id, '❌ Unauthorized');
  handlePendingDeposits(bot, msg.chat.id);
});

bot.onText(/\/pending_payouts/, (msg) => {
  if (!isAdmin(msg.chat.id)) return bot.sendMessage(msg.chat.id, '❌ Unauthorized');
  handlePendingPayouts(bot, msg.chat.id);
});

bot.onText(/\/stats/, (msg) => {
  if (!isAdmin(msg.chat.id)) return bot.sendMessage(msg.chat.id, '❌ Unauthorized');
  handleStats(bot, msg.chat.id);
});

bot.onText(/\/approve (.+)/, (msg, match) => {
  if (!isAdmin(msg.chat.id)) return bot.sendMessage(msg.chat.id, '❌ Unauthorized');
  const txId = match[1];
  handleApprove(bot, msg.chat.id, txId);
});

bot.onText(/\/reject (.+)/, (msg, match) => {
  if (!isAdmin(msg.chat.id)) return bot.sendMessage(msg.chat.id, '❌ Unauthorized');
  const txId = match[1];
  handleReject(bot, msg.chat.id, txId);
});

// 🔘 Button callbacks
bot.on('callback_query', (query) => {
  if (!isAdmin(query.message.chat.id)) {
    bot.answerCallbackQuery(query.id, { text: '❌ Unauthorized' });
    return;
  }
  handleCallback(bot, query);
});
