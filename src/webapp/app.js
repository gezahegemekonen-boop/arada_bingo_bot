const tg = window.Telegram.WebApp;
tg.expand();

const userId = tg.initDataUnsafe?.user?.id;
const username = tg.initDataUnsafe?.user?.username;

document.getElementById('welcome').innerText = `👋 Welcome, ${username || 'Player'}!`;

// Referral stats
fetch(`https://bingo-backend-vdeo.onrender.com/referral/${userId}`)
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      document.getElementById('referral').innerText =
        `🎯 Referral Code: ${data.referralCode}\n👥 Referrals: ${data.referrals}\n💰 Coins Earned: ${data.coinsEarned}`;
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
    alert(data.success ? `🎉 You played Bingo!\n💰 Coins: ${data.coins}\n🏆 Wins: ${data.wins}` : `❌ ${data.message}`);
  });
};

// Claim Reward
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
    alert(data.success ? `✅ Payout approved for ${amount} Br` : `❌ ${data.message}`);
  });
};

// Deposit Form
document.getElementById('depositBtn').onclick = () => {
  document.getElementById('depositForm').style.display = 'block';
};

document.getElementById('submitDeposit').onclick = () => {
  const amount = parseInt(document.getElementById('depositAmount').value);
  const method = document.getElementById('depositMethod').value;
  const txId = document.getElementById('depositTxId').value;
  const phone = document.getElementById('depositPhone').value;

  if (!amount || amount < 30) return alert('Minimum deposit is 30 Br');
  if (!['CBE', 'CBE_BIRR', 'TELEBIRR'].includes(method)) return alert('Invalid method');
  if (!txId) return alert('Transaction code required');

  fetch('https://bingo-backend-vdeo.onrender.com/deposit/confirm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ telegramId: userId, amount, method, txId, phone })
  })
  .then(res => res.json())
  .then(data => {
    alert(data.success ? '✅ Deposit submitted for review' : `❌ ${data.message}`);
    if (data.success) document.getElementById('depositForm').style.display = 'none';
  });
};

// Invite Friends
document.getElementById('inviteBtn').onclick = () => {
  tg.openTelegramLink(`https://t.me/your_bot_username?start=${userId}`);
};

// Leaderboard
fetch('https://bingo-backend-vdeo.onrender.com/players/leaderboard')
  .then(res => res.json())
  .then(data => {
    const list = document.getElementById('leaderboard');
    data.leaderboard.forEach((player, index) => {
      const li = document.createElement('li');
      li.innerText = `${index + 1}. ${player.username || player.telegramId} — 🏆 ${player.wins} wins`;
      list.appendChild(li);
    });
  });

// Payout History
fetch(`https://bingo-backend-vdeo.onrender.com/players/${userId}/payouts`)
  .then(res => res.json())
  .then(data => {
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
  });

// Admin Panel — Payouts
fetch('https://bingo-backend-vdeo.onrender.com/admin/payouts')
  .then(res => res.json())
  .then(data => {
    const list = document.getElementById('adminPayouts');
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
  });

window.approvePayout = (id) => {
  fetch(`https://bingo-backend-vdeo.onrender.com/admin/approve/${id}`, { method: 'POST' })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      location.reload();
    });
};

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

// ✅ Admin Panel — Deposits
fetch('https://bingo-backend-vdeo.onrender.com/admin/deposits')
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      const list = document.getElementById('adminDeposits');
      if (data.deposits.length === 0) {
        list.innerHTML = '<li>No deposit confirmations found.</li>';
      } else {
        data.deposits.forEach((deposit, index) => {
          const li = document.createElement('li');
          const date = new Date(deposit.submittedAt).toLocaleString();
          li.innerHTML = `
            ${index + 1}. <b>${deposit.username || deposit.telegramId}</b> — 💳 ${deposit.amount} Br via ${deposit.method}
            <br>📄 Code: ${deposit.txId} ${deposit.phone ? `📞 ${deposit.phone}` : ''} — 
            <i>${deposit.status.toUpperCase()}</i> on ${date}
            ${deposit.status === 'pending' ? `
              <button onclick="approveDeposit('${deposit._id}')">✅ Approve</button>
              <button onclick="rejectDeposit('${deposit._id}')">❌ Reject</button>
            ` : ''}
          `;
          list.appendChild(li);
        });
      }
    } else {
      document.getElementById('adminDeposits').innerText = 'Could not load deposit confirmations.';
    }
  });

// ✅ Approve deposit
window.approveDeposit = (id) => {
  fetch(`https://bingo-backend-vdeo.onrender.com/admin/approve-deposit/${id}`, {
    method: 'POST'
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message);
    location.reload();
  });
};

// ✅ Reject deposit
window.rejectDeposit = (id) => {
  fetch(`https://bingo-backend-vdeo.onrender.com/admin/reject-deposit/${id}`, {
    method: 'POST'
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message);
    location.reload();
  });
};
