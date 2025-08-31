// src/pages/GamePage.js
import { useState } from 'react';
import CountdownTimer from '../components/CountdownTimer';
import CardGrid from '../components/CardGrid';
import playAmharicWinAudio from '../components/AmharicAudio';

export default function GamePage() {
  const [countdownDone, setCountdownDone] = useState(false);
  const [userId] = useState('user123'); // Replace with actual user ID
  const [roundId] = useState('round456'); // Replace with actual round ID
  const [roundResult, setRoundResult] = useState(null);

  const handleCardPick = async (cardId) => {
    console.log(`Card ${cardId} picked by ${userId} in round ${roundId}`);

    // Simulate backend response
    const result = {
      message: cardId === 77 ? 'You won!' : 'Try again', // Example win logic
    };

    setRoundResult(result);

    if (result?.message?.includes('won')) {
      playAmharicWinAudio(); // 🔊 Play win sound
    }
  };

  return (
    <div className="game-page">
      {!countdownDone ? (
        <CountdownTimer seconds={5} onComplete={() => setCountdownDone(true)} />
      ) : (
        <CardGrid
          userId={userId}
          roundId={roundId}
          onCardPicked={handleCardPick}
        />
      )}

      {roundResult && (
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '18px' }}>
          {roundResult.message}
        </p>
      )}
    </div>
  );
}
