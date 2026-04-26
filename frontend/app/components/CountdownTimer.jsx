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
    <div className="flex space-x-3">
      <div className="bg-white border border-[#E5E0D8] px-3 py-2 rounded-lg text-center shadow-sm">
        <span className="font-mono font-bold text-[#1A1A1A] text-lg">{String(timeLeft.hours).padStart(2, '0')}</span>
        <p className="text-[10px] text-[#5C5C5C] uppercase tracking-widest mt-1">Hours</p>
      </div>
      <div className="bg-white border border-[#E5E0D8] px-3 py-2 rounded-lg text-center shadow-sm">
        <span className="font-mono font-bold text-[#1A1A1A] text-lg">{String(timeLeft.minutes).padStart(2, '0')}</span>
        <p className="text-[10px] text-[#5C5C5C] uppercase tracking-widest mt-1">Mins</p>
      </div>
      <div className="bg-white border border-[#E5E0D8] px-3 py-2 rounded-lg text-center shadow-sm">
        <span className="font-mono font-bold text-[#1A1A1A] text-lg">{String(timeLeft.seconds).padStart(2, '0')}</span>
        <p className="text-[10px] text-[#5C5C5C] uppercase tracking-widest mt-1">Secs</p>
      </div>
    </div>
  );
};

export default CountdownTimer; 