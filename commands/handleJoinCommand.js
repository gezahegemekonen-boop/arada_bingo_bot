const Player = require('../models/Player');
const { getOrCreateRoomByStake } = require('../utils/roomManager');
const { generateCard } = require('../utils/cardGenerator');

module.exports = (bot) => {
  bot.command('join', async (ctx) => {
    const args = ctx.message.text.split(' ');
    const stake = args[1];
    const lang = args[2] === 'am' ? 'am' : 'en'; // default to English

    if (!stake) {
      return ctx.reply('💰 Please specify a stake amount. Example: /join 10 am');
    }

    const telegramId = ctx.from.id.toString();
    const username = ctx.from.username || ctx.from.first_name;

    const room = getOrCreateRoomByStake(stake);
    const card = generateCard();

    const player = new Player({
      telegramId,
      username,
      stake,
      language: lang,
      card,
      hasWon: false,
    });

    room.players.push(player);

    const message = lang === 'am'
      ? '✅ በቢንጎ ዙር ተቀላቅለዋል። እንኳን ደስ አላችሁ!'
      : '✅ You’ve joined the Bingo round. Good luck!';
    ctx.reply(message
