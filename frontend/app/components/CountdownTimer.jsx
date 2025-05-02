"use client";

import { useState, useEffect } from 'react';

const CountdownTimer = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = endTime - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    // Cleanup
    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <div className="flex space-x-2">
      <div className="bg-gray-200 px-2 py-1 rounded text-center">
        <span className="font-mono font-bold">{String(timeLeft.hours).padStart(2, '0')}</span>
        <p className="text-xs">Hours</p>
      </div>
      <div className="bg-gray-200 px-2 py-1 rounded text-center">
        <span className="font-mono font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span>
        <p className="text-xs">Mins</p>
      </div>
      <div className="bg-gray-200 px-2 py-1 rounded text-center">
        <span className="font-mono font-bold">{String(timeLeft.seconds).padStart(2, '0')}</span>
        <p className="text-xs">Secs</p>
      </div>
    </div>
  );
};

export default CountdownTimer; 