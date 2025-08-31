import { useState } from 'react';
import CountdownTimer from '../components/CountdownTimer';
import CardGrid from '../components/CardGrid';
import playAmharicWinAudio from '../components/AmharicAudio';

export default function GamePage() {
  const [countdownDone, setCountdownDone] = useState(false);
  const [userId] = useState('user123');
  const [roundId, setRoundId] = useState(1);
  const [roundResult, setRoundResult] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isWaiting, setIsWaiting] = useState(false);

  const startNextRound = () => {
    setCountdownDone(false);
    setRoundResult(null);
    setSelectedCard(null);
    setIsWaiting(false);
    setRoundId(prev => prev + 1);
  };

  const handleCardPick = async (cardId) => {
    if (isWaiting || selectedCard) return;
    setIsWaiting(true);
    setSelectedCard(cardId);

    console.log(`Card ${cardId} picked by ${userId} in round ${roundId}`);

    const result = {
      message: cardId === 77 ? 'You won!' : 'Try again',
    };

    setRoundResult(result);

    if (result?.message?.includes('won')) {
      playAmharicWinAudio();
    }

    setTimeout(() => {
      startNextRound();
    }, 3000);
  };

  return (
    <div className="game-page">
      <h2 style={{ textAlign: 'center' }}>🎯 Round {roundId}</h2>

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
          selectedCard={selectedCard}
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
