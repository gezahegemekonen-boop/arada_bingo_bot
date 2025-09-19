// index.js

import 'dotenv/config';
import express from 'express';
import TelegramBot from 'node-telegram-bot-api';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import validator from 'validator';

import { GameManager } from './src/gameManager.js';
import { setupHandlers } from './src/setupHandlers.js';
import { generateBingoCard } from './src/utils/cards.js'; // moved to utils
import { initDb } from './src/db.js';

const token = process.env.BOT_TOKEN;
const adminId = process.env.ADMIN_ID;
const PORT = process.env.PORT || 10000;
const DB_URL = process.env.DB_URL;
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://arada-bingo.web.app';
const WEBHOOK_PATH = `/${token}`;
const WEBHOOK_URL = `https://${process.env.RENDER_EXTERNAL_HOSTNAME}${WEBHOOK_PATH}`;

// --- Validate env ---
if (!token || !DB_URL) {
  console.error('❌ Missing BOT_TOKEN or DB_URL in .env');
  process.exit(1);
}

// --- Express app ---
const app = express();
app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());
app.use(morgan('dev'));

// ✅ Health check
app.get('/', (_req, res) => res.send('🎯 Arada Bingo backend is live.'));

// ✅ Simple GET endpoint for testing
app.get('/api/play', (_req, res) => {
  const card = generateBingoCard();
  res.json({ success: true, card });
});

// ✅ API endpoint for frontend Web App
app.post('/api/play', async (req, res) => {
  const rawUserId = req.body.userId;
  const userId = validator.trim(rawUserId?.toString() || '');

  if (!validator.isNumeric(userId) || userId.length < 5) {
    console.log(`❌ Invalid userId: ${userId}`);
    return res.status(400).json({ error: 'Invalid userId' });
  }

  try {
    const gm = new GameManager({ bot, adminId });
    const result = await gm.buyCard(userId, 10); // default stake
    console.log(`🎲 User ${userId} played. Result:`, result);
    res.json({ success: true, result });
  } catch (error) {
    console.error(`❌ Error in /api/play for ${userId}:`, error.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// ✅ Telegram Bot (Webhook mode)
const bot = new TelegramBot(token);
bot.setWebHook(WEBHOOK_URL);

app.post(WEBHOOK_PATH, express.json(), (req, res) => {
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
