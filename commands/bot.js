const { Telegraf } = require('telegraf');
const mongoose = require('mongoose');

// Command handlers
const handleBingoCommand = require('./commands/handleBingoCommand');
const handleRejectCommand = require('./commands/handleRejectCommand');
const handleApproveCommand = require('./commands/handleApproveCommand');
const handlePendingCommand = require('./commands/handlePendingCommand');
const handleResetCommand = require('./commands/handleResetCommand');
const handleStartRoundCommand = require('./commands/handleStartRoundCommand');
const handleJoinCommand = require('./commands/handleJoinCommand');
const handleLeaveCommand = require('./commands/handleLeaveCommand');
const handleRoomsCommand = require('./commands/handleRoomsCommand');
const handleHelpCommand = require('./commands/handleHelpCommand');

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
handleResetCommand(bot);
handleStartRoundCommand(bot);
handleJoinCommand(bot);
handleLeaveCommand(bot);
handleRoomsCommand(bot);
handleHelpCommand(bot);

// Start bot
bot.launch();
console.log('🤖 Bingo bot is running...');
