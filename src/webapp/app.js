const tg = window.Telegram.WebApp;
tg.expand();

const userId = tg.initDataUnsafe?.user?.id;
const username = tg.initDataUnsafe?.user?.username;

document.getElementById('welcome').innerText = `👋 Welcome, ${username || 'Player'}!`;

// ✅ Referral stats
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

// ✅ Play Bingo
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

// ✅ Claim Reward (Payout)
document.getElementById('claimBtn').onclick = () => {
  const amount = parseInt(prompt('💰 Enter amount to withdraw (50–500 Br):'));
  if (isNaN(amount)) return alert('Invalid amount');

  fetch(`https://bingo-backend-vdeo.onrender.com/players/${userId}/payout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert(`✅ Payout approved for ${amount} Br`);
    } else {
      alert(`❌ ${data.message}`);
    }
  });
};

// ✅ Deposit
document.getElementById('depositBtn').onclick = () => {
  const amount = parseInt(prompt('💳 Enter deposit amount (min 30 Br):'));
  if (isNaN(amount) || amount < 30) return alert('Invalid amount');

  const method = prompt('Choose method: CBE, CBE_BIRR, TELEBIRR').toUpperCase();
  if (!['CBE', 'CBE_BIRR', 'TELEBIRR'].includes(method)) return alert('Invalid method');

  const txId = prompt('Enter transaction ID or reference number:');
  if (!txId) return alert('Transaction ID required');

  fetch('https://bingo-backend-vdeo.onrender.com/deposit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ telegramId: userId, amount, method, txId })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert(`✅ Deposit successful!\nNew coin balance: ${data.coins}`);
    } else {
      alert(`❌ ${data.message}`);
    }
  });
};

// ✅ Invite Friends
document.getElementById('inviteBtn').onclick = () => {
  tg.openTelegramLink(`https://t.me/your_bot_username?start=${userId}`);
};

// ✅ Leaderboard
fetch('https://bingo-backend-vdeo.onrender.com/players/leaderboard')
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      const list = document.getElementById('leaderboard');
      data.leaderboard.forEach((player, index) => {
        const li = document.createElement('li');
        li.innerText = `${index + 1}. ${player.username || player.telegramId} — 🏆 ${player.wins} wins`;
        list.appendChild(li);
      });
    } else {
      document.getElementById('leaderboard').innerText = 'Could not load leaderboard.';
    }
  });

// ✅ Payout History
fetch(`https://bingo-backend-vdeo.onrender.com/players/${userId}/payouts`)
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      const list = document.getElementById('payoutHistory');
      if (data.payouts.length === 0) {
        list.innerHTML = '<li>No payouts yet.</li>';
      } else {
        data.payouts.forEach((payout, index) => {
          const li = document.createElement('li');
          const date = new Date(payout.requestedAt).toLocaleString();
          li.innerText = `${index + 1}. 💰 ${payout.amount} Br — ${payout.status.toUpperCase()} on ${date}`;
          list.appendChild(li);
        });
      }
    } else {
      document.getElementById('payoutHistory').innerText = 'Could not load payout history.';
    }
  });

// ✅ Admin Panel — View and manage payouts
fetch('https://bingo-backend-vdeo.onrender.com/admin/payouts')
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      const list = document.getElementById('adminPayouts');
      if (data.payouts.length === 0) {
        list.innerHTML = '<li>No payout requests found.</li>';
      } else {
        data.payouts.forEach((payout, index) => {
          const li = document.createElement('li');
          const date = new Date(payout.requestedAt).toLocaleString();
          li.innerHTML = `
            ${index + 1}. <b>${payout.username || payout.telegramId}</b> — 💰 ${payout.amount} Br — 
            <i>${payout.status.toUpperCase()}</i> on ${date}
            ${payout.status === 'pending' ? `
              <button onclick="approvePayout('${payout._id}')">✅ Approve</button>
              <button onclick="rejectPayout('${payout._id}')">❌ Reject</button>
            ` : ''}
          `;
          list.appendChild(li);
        });
      }
    } else {
      document.getElementById('adminPayouts').innerText = 'Could not load admin payouts.';
    }
  });

// ✅ Approve payout
window.approvePayout = (id) => {
  fetch(`https://bingo-backend-vdeo.onrender.com/admin/approve/${id}`, {
    method: 'POST'
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message);
    location.reload();
  });
};

// ✅ Reject payout
window.rejectPayout = (id) => {
  fetch(`https://bingo-backend-vdeo.onrender.com/admin/reject/${id}`, {
    method: 'POST'
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message);
    location.reload();
  });
};
