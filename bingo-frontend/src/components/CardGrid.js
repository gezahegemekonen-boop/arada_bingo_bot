// src/components/CardGrid.js
import { useState } from 'react';
import { pickCard } from '../api';

export default function CardGrid({ userId, roundId, onCardPicked }) {
  const [selectedCard, setSelectedCard] = useState(null);
  const [message, setMessage] = useState('');

  const handlePick = async (cardId) => {
    setSelectedCard(cardId);
    const res = await pickCard(cardId, userId, roundId);
    setMessage(res.message || 'Card submitted');
    onCardPicked(cardId); // notify parent
  };

  return (
    <div className="card-grid">
      <h3>🎴 ካርድ ይምረጡ</h3>
      <div className="grid">
        {[...Array(100)].map((_, i) => (
          <button
            key={i}
            onClick={() => handlePick(i + 1)}
            className={selectedCard === i + 1 ? 'selected' : ''}
          >
            {i + 1}
          </button>
        ))}
      </div>
      {message && <p>{message}</p>}
    </div>
  );
}

