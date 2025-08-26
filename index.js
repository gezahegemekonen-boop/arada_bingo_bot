import 'dotenv/config';
import express from 'express';
import TelegramBot from 'node-telegram-bot-api';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

import { initDb } from './src/db.js';
import { GameManager } from './src/gameManager.js';
import { setupHandlers } from './src/handlers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

const app = express();
app.get('/', (_req, res) => res.send('Bingo Bot is running.'));
app.use('/static', express.static(path.join(__dirname, 'static')));

app.listen(PORT, () => console.log(`🌐 Web server on :${PORT}`));

// --- DB ---
await initDb(process.env.DB_URL);

// --- Telegram Bot (polling) ---
const bot = new TelegramBot(token, { polling: true });
console.log('🤖 Telegram bot started (polling)…');

// --- Game manager (singleton) ---
const gm = new GameManager({ bot, adminId });

// --- Handlers connect bot <-> logic ---
setupHandlers({ bot, gm, adminId });

export { bot, gm };
