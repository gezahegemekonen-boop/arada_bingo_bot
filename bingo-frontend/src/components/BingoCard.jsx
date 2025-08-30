import React from 'react';

export default function BingoCard({ cardId }) {
  // Placeholder numbers — replace with real card data from backend
  const numbers = Array.from({ length: 25 }, (_, i) => i + 1 + cardId);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 5, marginTop: 10 }}>
      {numbers.map((num, i) => (
        <div
          key={i}
          style={{
            padding: 10,
            backgroundColor: i === 12 ? '#4CAF50' : '#fff',
            border: '1px solid #ccc',
            textAlign: 'center'
          }}
        >
          {i === 12 ? '★' : num}
        </div>
      ))}
    </div>
  );
}

