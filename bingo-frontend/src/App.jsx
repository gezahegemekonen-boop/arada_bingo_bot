import React, { useState, useEffect } from 'react';
import BingoCard from './components/BingoCard';
import { pickCard, playRound } from './api';

export default function App() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [countdown, setCountdown] = useState(50);
  const [serverMessage, setServerMessage] = useState('');
  const [roundResult, setRoundResult] = useState(null);

  const userId = 'mekonen123'; // Replace with Telegram user ID
  const roundId = 'BB216033';  // Replace with dynamic round ID later

  useEffect(() => {
    if (selectedCard) {
      const interval = setInterval(() => {
        setCountdown(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [selectedCard]);

  useEffect(() => {
    if (countdown === 0 && selectedCard) {
      playRound(userId, roundId).then(res => {
        setRoundResult(res);
        if (res.message?.includes('won')) {
          const audio = new Audio('/sounds/win-amharic.mp3');
          audio.play();
        }
      });
    }
  }, [countdown]);

  const handleCardPick = async (cardId) => {
    setSelectedCard(cardId);
    const res = await pickCard(cardId, userId, roundId);
    setServerMessage(res.message || 'Card submitted');
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
          {serverMessage && <p style={{ marginTop: 10 }}>{serverMessage}</p>}
        </div>
      )}

      {roundResult && (
        <div style={{ marginTop: 30 }}>
          <h2>🎉 የዙር ውጤት</h2>
          <pre>{JSON.stringify(roundResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
