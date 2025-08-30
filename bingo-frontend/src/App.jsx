import React, { useState, useEffect } from 'react';
import BingoCard from './components/BingoCard';
import { pickCard } from './api';

export default function App() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [countdown, setCountdown] = useState(50);
  const userId = 'mekonen123'; // Replace with Telegram user ID
  const roundId = 'BB216033'; // Dynamic in real game

  useEffect(() => {
    if (selectedCard) {
      const interval = setInterval(() => {
        setCountdown(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [selectedCard]);

  const handleCardPick = async (cardId) => {
    setSelectedCard(cardId);
    await pickCard(cardId, userId, roundId);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🎯 ካርድ ይምረጡ</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {[...Array(100)].map((_, i) => (
          <button
            key={i}
            onClick={() => handleCardPick(i + 1)}
            style={{
              padding: '10px 20px',
              backgroundColor: selectedCard === i + 1 ? '#4CAF50' : '#eee',
              border: '1px solid #ccc',
              borderRadius: 5
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {selectedCard && (
        <div style={{ marginTop: 20 }}>
          <h2>✅ እርስዎ የመረጡት ካርድ: {selectedCard}</h2>
          <h3>⏱️ የጨዋታ መጀመሪያ ቀረ: {countdown} ሰከንድ</h3>
          <BingoCard cardId={selectedCard} />
        </div>
      )}
    </div>
  );
}

