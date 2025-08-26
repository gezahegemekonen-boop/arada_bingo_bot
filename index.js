import 'dotenv/config';
import express from 'express';
import TelegramBot from 'node-telegram-bot-api';
import mongoose from 'mongoose';

import { initDb } from './src/db.js';
import { GameManager } from './src/gameManager.js';
import { setupHandlers } from './src/handlers.js';

const token = process.env.BOT_TOKEN;
const adminId = process.env.ADMIN_ID;
const PORT = process.env.PORT || 10000;

if (!token) {
  console.error('❌ BOT_TOKEN missing in .env');
  process.exit(1);
}
if (!process.env.DB_URL) {
  console.error('❌ DB_URL missing in .env');
  process.exit(1);
}

// --- Express app ---
const app = express();

// Health check
app.get('/', (_req, res) => res.send('Bingo Bot is running.'));

// --- Start server ---
app.listen(PORT, () => console.log(`🌐 Web server on :${PORT}`));

// --- DB ---
await initDb(process.env.DB_URL);

// --- Telegram Bot (Webhook mode) ---
const bot = new TelegramBot(token);

// Tell Telegram to send updates to our Render service
bot.setWebHook(`https://${process.env.RENDER_EXTERNAL_HOSTNAME}/${token}`);

// Webhook endpoint
app.post(`/${token}`, express.json(), (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

console.log('🤖 Telegram bot started (webhook)…');

// --- Game manager ---
const gm = new GameManager({ bot, adminId });

// --- Handlers ---
setupHandlers({ bot, gm, adminId });

export { bot, gm };
