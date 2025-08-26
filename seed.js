// seed.js
const mongoose = require('mongoose');
const Player = require('./models/Player');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await Player.create({
    telegramId: '123456789', // your Telegram ID
    balance: 1000,
    isAdmin: true,
  });
  console.log('Admin player created');
  process.exit();
});
