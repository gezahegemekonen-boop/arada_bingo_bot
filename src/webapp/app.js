const tg = window.Telegram.WebApp;
tg.expand();

const userId = tg.initDataUnsafe?.user?.id;
const username = tg.initDataUnsafe?.user?.username;

document.getElementById('welcome').innerText = `👋 Welcome, ${username || 'Player'}!`;

// Fetch referral stats
fetch(`https://bingo-backend-vdeo.onrender.com/referral/${userId}`)
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      document.getElementById('referral').innerText =
        `🎯 Referral Code: ${data.referralCode}\n👥 Referrals: ${data.referrals}\n💰 Coins Earned: ${data.coinsEarned}`;
    } else {
      document.getElementById('referral').innerText = 'Referral data not found.';
    }
  });

// Play Bingo
document.getElementById('playBtn').onclick = () => {
  fetch(`https://bingo-backend-vdeo.onrender.com/players/${userId}/play`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ telegramId: userId })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert(`🎉 You played Bingo!\n💰 Coins: ${data.coins}\n🏆 Wins: ${data.wins}`);
    } else {
      alert(`❌ ${data.message}`);
    }
  });
};

// Invite Friends
document.getElementById('inviteBtn').onclick = () => {
  tg.openTelegramLink(`https://t.me/your_bot_username?start=${userId}`);
};
