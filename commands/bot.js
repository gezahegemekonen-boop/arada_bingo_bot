const { Telegraf } = require('telegraf');
const mongoose = require('mongoose');
const handleBingoCommand = require('./commands/handleBingoCommand');
const handleRejectCommand = require('./commands/handleRejectCommand');
const handleApproveCommand = require('./commands/handleApproveCommand');
const handlePendingCommand = require('./commands/handlePendingCommand');
const handleResetCommand = require('./commands/handleResetCommand'); // ✅ New

const bot = new Telegraf(process.env.BOT_TOKEN);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Register commands
bot.command('bingo', (ctx) => handleBingoCommand(ctx));
handleRejectCommand(bot);
handleApproveCommand(bot);
handlePendingCommand(bot);
handleResetCommand(bot); // ✅ Register /reset

// Start bot
bot.launch();
console.log('🤖 Bot is running...');
