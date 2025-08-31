import { useState } from 'react';
import { pickCard } from '../api';
import './CardGrid.css';

export default function CardGrid({
  userId,
  roundId,
  onCardPicked,
  selectedCard,
  countdownActive // 👈 new prop to control interaction
}) {
  const [message, setMessage] = useState('');

  const handlePick = async (cardId) => {
    if (!countdownActive) return; // ⛔ prevent picking after countdown
    setMessage(`You selected card ${cardId}`);
    onCardPicked(cardId);

    // Optional: send to backend only after countdown ends
    // const res = await pickCard(cardId, userId, roundId);
    // setMessage(res.message || 'ካርድ ተሰጥቷል');
  };

  return (
    <div className="card-grid">
      <h3>🎴 ካርድ ይምረጡ</h3>
      <div className="grid">
        {[...Array(100)].map((_, i) => {
          const cardId = i + 1;
          const isPicked = selectedCard === cardId;

          return (
            <button
              key={cardId}
              onClick={() => handlePick(cardId)}
              className={isPicked ? 'selected' : ''}
              disabled={!countdownActive}
            >
              {cardId}
            </button>
          );
        })}
      </div>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
