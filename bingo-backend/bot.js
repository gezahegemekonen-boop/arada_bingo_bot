bot.onText(/\/approve (.+) (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const txId = match[1];
  const note = match[2];

  try {
    const res = await fetch(`https://yourdomain.com/api/admin/approve/${txId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminNote: note })
    });
    const data = await res.json();
    bot.sendMessage(chatId, `✅ Approved: ${data.transaction.amount} birr for ${data.transaction.userId}`);
  } catch (err) {
    bot.sendMessage(chatId, '❌ Approval failed');
  }
});

bot.onText(/\/reject (.+) (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const txId = match[1];
  const note = match[2];

  try {
    const res = await fetch(`https://yourdomain.com/api/admin/reject/${txId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminNote: note })
    });
    const data = await res.json();
    bot.sendMessage(chatId, `❌ Rejected: ${data.transaction.amount} birr for ${data.transaction.userId}`);
  } catch (err) {
    bot.sendMessage(chatId, '❌ Rejection failed');
  }
});
