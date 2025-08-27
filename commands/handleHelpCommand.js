module.exports = (bot) => {
  bot.command('help', async (ctx) => {
    const message = `
🆘 *Bingo Bot Help Guide*

Here are the main commands you can use:

/join <stake> <am|en> – Join a Bingo room with your stake and language  
/card – View your current Bingo card  
/bingo – Claim Bingo if you’ve won  
/leave – Exit your current Bingo room  
/startRound – Admin only: start a new round  
/approve <playerId> – Admin only: approve a win  
/reject <playerId> – Admin only: reject a win  
/reset – Admin only: reset your room  
/rooms – View active Bingo rooms  
/help – Show this help message

Good luck and have fun! 🎉
    `;
    ctx.replyWithMarkdown(message);
  });
};
