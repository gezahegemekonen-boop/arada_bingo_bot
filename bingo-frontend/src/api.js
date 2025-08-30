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
