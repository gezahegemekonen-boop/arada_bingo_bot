module.exports = function(bot) {
  bot.onText(/\/instruction/, (msg) => {
    const chatId = msg.chat.id;
    const lang = msg.from.language_code || 'en';

    const message = lang.startsWith('am')
      ? `
🎯 *የቢንጎ መመሪያ*:

1️⃣ /deposit በመጠቀም ገንዘብ አከል።  
2️⃣ /convert በመጠቀም ቀሪዎን ኮይን ውስጥ ቀይር።  
3️⃣ /play በመጠቀም ጨዋታ ጀምር።  
4️⃣ ቢንጎ ካሸነፈክ፣ ኮይን ወደ ቀሪ ይቀየራል።  
5️⃣ /withdraw በመጠቀም ቀሪ ወደ ቴሌቢር ወይም ባንክ አውጣ።

💡 ተጨማሪ መረጃ፦  
• /balance ቀሪን እና ኮይን አሳይ  
• /transaction የንብረት ታሪክ አሳይ  
• /language ቋንቋ ቀይር  
• /invite ጓደኞችን አከብር
`
      : `
🎯 *How to Play Bingo*:

1️⃣ Use /deposit to add funds  
2️⃣ Use /convert to turn balance into coins  
3️⃣ Use /play to start a Bingo game  
4️⃣ If you win, coins convert back to wallet  
5️⃣ Use /withdraw to cash out via Telebirr or bank

💡 More tools:  
• /balance to check wallet and coins  
• /transaction to view history  
• /language to switch language  
• /invite to share with friends
`;

    bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  });
};
