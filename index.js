import 'dotenv/config';
import express from 'express';
import TelegramBot from 'node-telegram-bot-api';
import mongoose from 'mongoose';
import cors from 'cors';

import { initDb } from './src/db.js';
import { GameManager } from './src/gameManager.js';
import { setupHandlers } from './src/setupHandlers.js';
import { playGame } from './src/gameManager.js'; // ✅ Import your play logic

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
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (_req, res) => res.send('Bingo Bot is running.'));

// ✅ API endpoint for frontend Web App
app.post('/api/play', async (req, res) => {
  const { userId } = req.body;
  try {
    const result = await playGame(userId); // reuse your game logic
    res.json(result);
  } catch (error) {
    console.error('Error in /api/play:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// --- Start server ---
app.listen(PORT, () => console.log(`🌐 Web server on :${PORT}`));

// --- DB ---
await initDb(process.env.DB_URL);

// --- Telegram Bot (Webhook mode) ---
const bot = new TelegramBot(token);
bot.setWebHook(`https://${process.env.RENDER_EXTERNAL_HOSTNAME}/${token}`);

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
