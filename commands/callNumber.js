const amharicAudioMap = require('../utils/amharicAudioMap');
const getBingoLetter = require('../utils/getBingoLetter');

module.exports = async function callNumber(bot, number, players) {
  const letter = getBingoLetter(number);

  for (const player of players) {
    if (player.language === 'am') {
      const audioPath = amharicAudioMap[letter]?.[number];
      if (audioPath) {
        await bot.telegram.sendAudio(player.telegramId, { source: audioPath });
      } else {
        await bot.telegram.sendMessage(player.telegramId, `🔢 ${letter}${number}`);
      }
    } else {
      await bot.telegram.sendMessage(player.telegramId, `🔢 ${letter}${number}`);
    }
  }
};
