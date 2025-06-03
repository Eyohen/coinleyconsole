// src/components/CountdownTimer.jsx
import React, { useState, useEffect } from 'react';
import { RiTimer2Line } from 'react-icons/ri';
import { useDarkMode } from '../../context/DarkModeContext';

const CountdownTimer = ({ 
  seconds, 
  onComplete, 
  text = "Resend code in", 
  className = "" 
}) => {
  const { darkMode } = useDarkMode();
  const [countdown, setCountdown] = useState(seconds);
  
  useEffect(() => {
    if (countdown <= 0) {
      onComplete && onComplete();
      return;
    }
    
    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [countdown, onComplete]);
  
  // Format seconds into minutes and seconds if needed
  const formatTime = () => {
    if (countdown < 60) {
      return `${countdown}s`;
    }
    
    const minutes = Math.floor(countdown / 60);
    const remainingSeconds = countdown % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  return (
    <span className={`flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-500'} ${className}`}>
      <RiTimer2Line className="mr-1" />
      {text} {formatTime()}
    </span>
  );
};

export default CountdownTimer;