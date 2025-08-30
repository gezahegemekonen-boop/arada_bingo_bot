const BASE_URL = import.meta.env.VITE_API_URL;

export async function pickCard(cardId, userId, roundId) {
  const res = await fetch(`${BASE_URL}/api/pick-card`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cardId, userId, roundId })
  });
  return res.json();
}

export async function playRound(userId, roundId) {
  const res = await fetch(`${BASE_URL}/api/play`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, roundId })
  });
  return res.json();
}
