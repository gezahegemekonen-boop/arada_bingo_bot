// index.js

import 'dotenv/config';
import express from 'express';
import TelegramBot from 'node-telegram-bot-api';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import validator from 'validator';

import { initDb } from './src/db.js';
import { GameManager } from './src/gameManager.js';
import { GameManager } from './src/gameManager.js';
import { setupHandlers } from './src/setupHandlers.js';

const token = process.env.BOT_TOKEN;
const adminId = process.env.ADMIN_ID;
const PORT = process.env.PORT || 10000;
const DB_URL = process.env.DB_URL;
const FRONTEND_URL = 'https://arada-bingo.web.app';

// --- Validate env ---
if (!token) {
  console.error('❌ BOT_TOKEN missing in .env');
  process.exit(1);
}
if (!DB_URL) {
  console.error('❌ DB_URL missing in .env');
  process.exit(1);
}

// --- Express app ---
const app = express();

// 🔒 Secure CORS: only allow your frontend
app.use(cors({ origin: FRONTEND_URL }));

// 🧾 Parse JSON bodies
app.use(express.json());

// 📋 Log every request
app.use(morgan('dev'));

// ✅ Health check
app.get('/', (_req, res) => res.send('🎯 Bingo Bot backend is running.'));

// ✅ API endpoint for frontend Web App
app.post('/api/play', async (req, res) => {
  const rawUserId = req.body.userId;

  // 🧼 Sanitize
  const userId = validator.trim(rawUserId?.toString() || '');

  // ✅ Validate
  if (!validator.isNumeric(userId) || userId.length < 5) {
    console.log(`❌ Invalid userId: ${userId}`);
    return res.status(400).json({ error: 'Invalid userId' });
  }

  try {
    const result = await playGame(userId);
    console.log(`🎲 User ${userId} played. Result:`, result);
    res.json(result);
  } catch (error) {
    console.error(`❌ Error in /api/play for ${userId}:`, error.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// ✅ Telegram Bot (Webhook mode)
const bot = new TelegramBot(token);
bot.setWebHook(`https://${process.env.RENDER_EXTERNAL_HOSTNAME}/${token}`);

app.post(`/${token}`, express.json(), (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🌐 Web server running on port ${PORT}`);
});

// ✅ Connect to DB
try {
  await initDb(DB_URL);
  console.log('✅ MongoDB connected');
} catch (err) {
  console.error('❌ DB connection failed:', err);
  process.exit(1);
}

// ✅ Game manager and handlers
const gm = new GameManager({ bot, adminId });
setupHandlers({ bot, gm, adminId });

console.log('🤖 Telegram bot started (webhook mode)…');

export { bot, gm };
