const { generateBingoCard, BingoGame, checkWin } = require('./game');

const card = generateBingoCard();
const game = new BingoGame();
game.drawnNumbers = [card[0][0], card[1][1], card[2][2], card[3][3], card[4][4]];

console.log("Card:", card);
console.log("Win?", checkWin(card, game.drawnNumbers));

require("dotenv").config();
const mongoose = require("mongoose");
const { Telegraf } = require("telegraf");
const express = require("express");

// Load models
const Game = require("./models/Game");
const Player = require("./models/Player");
const Transaction = require("./models/Transaction");
const User = require("./models/User");

// Create bot
const bot = new Telegraf(process.env.BOT_TOKEN);

// Connect to MongoDB
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Simple /start command
bot.start(async (ctx) => {
  try {
    const telegramId = String(ctx.from.id);
    const username = ctx.from.username || "unknown";

    let player = await Player.findOne({ userId: telegramId });
    if (!player) {
      player = new Player({ userId: telegramId, username });
      await player.save();
      console.log(`🆕 New player created: ${username} (${telegramId})`);
    }

    await ctx.reply(`👋 Welcome to Bingo, ${username}!`);
  } catch (err) {
    console.error("Error in /start:", err);
    ctx.reply("⚠️ Something went wrong. Please try again.");
  }
});

// Example admin-only command
bot.command("stats", async (ctx) => {
  if (String(ctx.from.id) !== String(process.env.ADMIN_ID)) {
    return ctx.reply("⛔ You are not authorized to use this command.");
  }

  const totalPlayers = await Player.countDocuments();
  const totalGames = await Game.countDocuments();
  ctx.reply(`📊 Stats:\nPlayers: ${totalPlayers}\nGames: ${totalGames}`);
});

// Launch bot
bot.launch()
  .then(() => console.log("🤖 Bingo bot is running..."))
  .catch((err) => console.error("❌ Bot launch failed:", err));

// Graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

// 👉 Add a small Express server so Render detects a port
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("🤖 Bingo bot is alive and running!");
});

app.listen(PORT, () => {
  console.log(`🌍 Express server listening on port ${PORT}`);
});

