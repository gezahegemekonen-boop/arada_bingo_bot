import TelegramBot from "node-telegram-bot-api";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// Environment variables
const token = process.env.BOT_TOKEN;
const dbUrl = process.env.DB_URL;
const adminId = process.env.ADMIN_ID;

const bot = new TelegramBot(token, { polling: true });

// Connect MongoDB
mongoose.connect(dbUrl).then(() => console.log("✅ MongoDB Connected"));

// Start Bot
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "🎉 Welcome to Bingo Bot!\nUse the menu to play.");
});

