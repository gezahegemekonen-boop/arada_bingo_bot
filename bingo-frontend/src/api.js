export async function pickCard(cardId, userId, roundId) {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/pick-card`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cardId, userId, roundId })
    });
    return await res.json();
  } catch (err) {
    console.error('Card pick failed:', err);
  }
}

