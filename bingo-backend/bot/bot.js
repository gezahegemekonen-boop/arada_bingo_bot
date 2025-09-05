import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const ADMIN_ID = process.env.ADMIN_ID;
const BACKEND_URL = process.env.BACKEND_URL;

// ✅ /start — initialize wallet and track referral
bot.onText(/\/start(?:\s+(\S+))?/, async (msg, match) => {
  const chatId = msg.chat.id.toString();
  const referralCode = match[1]; // may be undefined

  try {
    // Create or update player
    await fetch(`${BACKEND_URL}/players/${chatId}`, { method: 'PUT' });

    // If referral code is present and not self-referral
    if (referralCode && referralCode !== chatId) {
      await fetch(`${BACKEND_URL}/referral/${referralCode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newUserId: chatId })
      });
    }

    bot.sendMessage(chatId, '🎉 Welcome to Arada Bingo! Your wallet is ready.');
  } catch (err) {
    console.error('Start error:', err.message);
    bot.sendMessage(chatId, '⚠️ Could not initialize your wallet.');
  }
});

// 💰 /balance — show wallet and coins
bot.onText(/\/balance/, async (msg) => {
  const chatId = msg.chat.id.toString();
  try {
    const res = await fetch(`${BACKEND_URL}/players/${chatId}`);
    const data = await res.json();
    bot.sendMessage(chatId, `💰 Wallet: ${data.wallet} birr\n🎯 Coins: ${data.coins}`);
  } catch (err) {
    console.error('Balance error:', err.message);
    bot.sendMessage(chatId, '⚠️ Could not fetch your balance.');
  }
});

// ✅ /approve txId note — admin approves transaction
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
    console.error('Approve error:', err.message);
    bot.sendMessage(chatId, '❌ Approval failed. Check backend or txId.');
  }
});

// ❌ /reject txId note — admin rejects transaction
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
    console.error('Reject error:', err.message);
    bot.sendMessage(chatId, '❌ Rejection failed. Check backend or txId.');
  }
});

// 🕒 /pending — list pending transactions
bot.onText(/\/pending/, async (msg) => {
  const chatId = msg.chat.id.toString();
  if (chatId !== ADMIN_ID) return;

  try {
    const res = await fetch(`${BACKEND_URL}/api/admin/pending`);
    const data = await res.json();
    if (!data.transactions.length) {
      return bot.sendMessage(chatId, '✅ No pending transactions.');
    }

    const list = data.transactions.map(tx =>
      `🕒 ${tx._id}: ${tx.amount} birr for ${tx.userId}`
    ).join('\n');

    bot.sendMessage(chatId, list);
  } catch (err) {
    console.error('Pending error:', err.message);
    bot.sendMessage(chatId, '⚠️ Failed to fetch pending transactions.');
  }
});
