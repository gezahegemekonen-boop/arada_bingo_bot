exports.handleStats = async (bot, msg) => {
  const res = await fetch(`${process.env.BACKEND_URL}/admin/stats`, {
    headers: { 'x-admin-token': process.env.ADMIN_SECRET },
  });
  const stats = await res.json();
  bot.sendMessage(msg.chat.id, `📊 Stats:\nWins: ${stats.wins}\nDeposits: ${stats.deposits}`);
};

