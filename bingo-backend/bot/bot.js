import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const ADMIN_ID = process.env.ADMIN_ID; // Your Telegram user ID
const BACKEND_URL = process.env.BACKEND_URL; // e.g. https://arada-bingo.onrender.com

// ✅ /approve command
bot.onText(/\/approve (\w+) (.+)/, async (msg, match) => {
  const chatId = msg.chat.id.toString();
  if (chatId !== ADMIN_ID) return;

  const txId = match[1];
  const note = match[2];

  try {
    const res = await fetch(`${BACKEND_URL}/api/admin/approve/${txId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminNote: note })
    });
    const data = await res.json();
    bot.sendMessage(chatId, `✅ Approved ${data.transaction.amount} birr for ${data.transaction.userId}`);
  } catch (err) {
    bot.sendMessage(chatId, '❌ Approval failed. Check backend or txId.');
  }
});

// ❌ /reject command
bot.onText(/\/reject (\w+) (.+)/, async (msg, match) => {
  const chatId = msg.chat.id.toString();
  if (chatId !== ADMIN_ID) return;

  const txId = match[1];
  const note = match[2];

  try {
    const res = await fetch(`${BACKEND_URL}/api/admin/reject/${txId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminNote: note })
    });
    const data = await res.json();
    bot.sendMessage(chatId, `❌ Rejected ${data.transaction.amount} birr for ${data.transaction.userId}`);
  } catch (err) {
    bot.sendMessage(chatId, '❌ Rejection failed. Check backend or txId.');
  }
});

