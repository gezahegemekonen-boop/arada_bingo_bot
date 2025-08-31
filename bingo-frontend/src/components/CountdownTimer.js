// src/components/CountdownTimer.js
import { useEffect, useState } from 'react';

export default function CountdownTimer({ seconds, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete(); // notify parent
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, onComplete]);

  return (
    <div className="countdown">
      <h4>⏳ ጨዋታ በ {timeLeft} ሰከንድ ይጀምራል</h4>
    </div>
  );
}

