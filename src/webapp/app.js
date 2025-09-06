const tg = window.Telegram.WebApp;
tg.expand();

const userId = tg.initDataUnsafe?.user?.id;
const username = tg.initDataUnsafe?.user?.username;

document.getElementById('welcome').innerText = `👋 Welcome, ${username || 'Player'}!`;

fetch(`https://bingo-backend-vdeo.onrender.com/referral/${userId}`)
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      document.getElementById('referral').innerText =
        `Your referral code: ${data.referralCode}\nReferrals: ${data.referrals}\nCoins: ${data.coinsEarned}`;
    } else {
      document.getElementById('referral').innerText = 'Referral data not found.';
    }
  });

document.getElementById('inviteBtn').onclick = () => {
  tg.openTelegramLink(`https://t.me/your_bot_username?start=${userId}`);
};

