// src/pages/GamePage.js
import { useState } from 'react';
import CountdownTimer from '../components/CountdownTimer';
import CardGrid from '../components/CardGrid';
import playAmharicWinAudio from '../components/AmharicAudio';

export default function GamePage() {
  const [countdownDone, setCountdownDone] = useState(false);
  const [userId] = useState('user123'); // Replace with actual user ID
  const [roundId, setRoundId] = useState(1); // Track round number
  const [roundResult, setRoundResult] = useState(null);
  const [isWaiting, setIsWaiting] = useState(false); // Prevent double picks

  const startNextRound = () => {
    setCountdownDone(false);
    setRoundResult(null);
    setIsWaiting(false);
    setRoundId(prev => prev + 1);
  };

  const handleCardPick = async (cardId) => {
    if (isWaiting) return;
    setIsWaiting(true;

    console.log(`Card ${cardId} picked by ${userId} in round ${roundId}`);

    // Simulate backend response
    const result = {
      message: cardId === 77 ? 'You won!' : 'Try again', // Example win logic
    };

    setRoundResult(result);

    if (result?.message?.includes('won')) {
      playAmharicWinAudio(); // 🔊 Play win sound
    }

    // Start next round after short delay
    setTimeout(() => {
      startNextRound();
    }, 3000); // Show result for 3 seconds
  };

  return (
    <div className="game-page">
      {!countdownDone ? (
        <CountdownTimer
          seconds={roundId === 1 ? 5 : 50}
          onComplete={() => setCountdownDone(true)}
        />
      ) : (
        <CardGrid
          userId={userId}
          roundId={`round${roundId}`}
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
