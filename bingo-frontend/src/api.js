const BASE_URL = import.meta.env.VITE_API_URL;

// ✅ Card selection API
export async function pickCard(cardId, userId, roundId) {
  try {
    const res = await fetch(`${BASE_URL}/api/pick-card`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cardId, userId, roundId })
    });
    return await res.json();
  } catch (err) {
    console.error('Card pick failed:', err);
    return { message: 'Failed to pick card' };
  }
}

// ✅ Play round API (triggered after countdown)
export async function playRound(userId, roundId) {
  try {
    const res = await fetch(`${BASE_URL}/api/play`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, roundId })
    });
    return await res.json();
  } catch (err) {
    console.error('Play round failed:', err);
    return { message: 'Failed to play round' };
  }
}

// ✅ Deposit API
export async function deposit(userId, amount) {
  try {
    const res = await fetch(`${BASE_URL}/api/deposit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, amount })
    });
    return await res.json();
  } catch (err) {
    console.error('Deposit failed:', err);
    return { message: 'Failed to deposit' };
  }
}

// ✅ Get balance API
export async function getBalance(userId) {
  try {
    const res = await fetch(`${BASE_URL}/api/balance?userId=${userId}`);
    return await res.json();
  } catch (err) {
    console.error('Balance fetch failed:', err);
    return { balance: 0, message: 'Failed to fetch balance' };
  }
}

// ✅ Admin approval API
export async function adminApprove(transactionId, status) {
  try {
    const res = await fetch(`${BASE_URL}/api/admin/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactionId, status }) // status: 'approved' | 'rejected'
    });
    return await res.json();
  } catch (err) {
    console.error('Admin approval failed:', err);
    return { message: 'Failed to update transaction status' };
  }
}
