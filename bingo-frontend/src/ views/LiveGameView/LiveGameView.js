import { useState } from 'react';
import CountdownTimer from '../../components/CountdownTimer';
import CardGrid from '../../components/CardGrid';
import './LiveGameView.css';

export default function LiveGameView() {
  const [roundId, setRoundId] = useState(1);
  const [selectedCard, setSelectedCard] = useState(null);
  const [countdownDone, setCountdownDone] = useState(false);
  const [calledNumber, setCalledNumber] = useState(null);
  const [canClaimBingo, setCanClaimBingo] = useState(false);

  const handleCardPick = (cardId) => {
    setSelectedCard(cardId);
  };

  const handleCountdownEnd = () => {
    setCountdownDone(true);
    setCalledNumber(Math.floor(Math.random() * 100) + 1);
    setCanClaimBingo(true);
  };

  const handleLeaveGame = () => {
    console.log('Leaving game...');
  };

  const handleRefresh = () => {
    setSelectedCard(null);
    setCountdownDone(false);
    setCanClaimBingo(false);
    setRoundId(prev => prev + 1);
  };

  return (
    <div className="bingo-container">
      <header>
        <h2>🎯 Round {roundId}</h2>
        {calledNumber && <p>Called Number: <strong>{calledNumber}</strong></p>}
      </header>

      {!countdownDone ? (
        <CountdownTimer seconds={50} onComplete={handleCountdownEnd} />
      ) : (
        <CardGrid
          userId="user123"
          roundId={`round${roundId}`}
          onCardPicked={handleCardPick}
          selectedCard={selectedCard}
          countdownActive={countdownDone}
        />
      )}

      <footer>
        <button onClick={handleLeaveGame}>Leave</button>
        <button onClick={handleRefresh}>Refresh</button>
        <button disabled={!canClaimBingo}>BINGO</button>
      </footer>
    </div>
  );
}

