require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// 🧩 Player Commands
require('./commands/player/deposit')(bot);
require('./commands/player/convert')(bot);
require('./commands/player/play')(bot);
require('./commands/player/balance')(bot);
require('./commands/player/withdraw')(bot);
require('./commands/player/instruction')(bot);  // ✅ Added here
require('./commands/player/language')(bot);
require('./commands/player/transaction')(bot);
require('./commands/player/invite')(bot);

// 🛠️ Admin Commands (if needed)
require('./commands/admin/approve')(bot);
require('./commands/admin/reject')(bot);
require('./commands/admin/pending')(bot);

// 🧪 Optional: Demo Mode
require('./commands/player/demo')(bot);

// 🧠 Default fallback
bot.on('message', (msg) => {
  if (!msg.text.startsWith('/')) {
    bot.sendMessage(msg.chat.id, '🤖 Please use a command like /instruction or /play to get started.');
  }
});
