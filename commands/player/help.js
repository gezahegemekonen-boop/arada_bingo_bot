module.exports = function(bot) {
  bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    const lang = msg.from.language_code || 'en';

    const helpText = lang.startsWith('am')
      ? `
🎮 *የተጫዋች መዝገብ*:

/start - ጨዋታ ጀምር  
/play - ቢንጎ ጫው  
/withdraw - ቀሪ አውጣ  
/balance - ቀሪ አሳይ  
/deposit - ገንዘብ አከል  
/language - ቋንቋ ቀይር  
/convert - ኮይን ወደ ቀሪ ቀይር  
/transaction - የንብረት ታሪክ  
/game - የጨዋታ ታሪክ  
/instruction - መመሪያ  
/invite - ጓደኞችን አከብር
`
      : `
🎮 *Player Menu*:

/start - Start the game  
/play - Play Bingo  
/withdraw - Withdraw balance  
/balance - Check balance  
/deposit - Deposit funds  
/language - Choose language  
/convert - Convert coins to wallet  
/transaction - View transaction history  
/game - View game history  
/instruction - Game instructions  
/invite - Invite friends to play Bingo
`;

    bot.sendMessage(chatId, helpText, { parse_mode: 'Markdown' });
  });
};
