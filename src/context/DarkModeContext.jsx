// src/context/DarkModeContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create Dark Mode Context
const DarkModeContext = createContext();

// Dark Mode Provider Component
export const DarkModeProvider = ({ children }) => {
  // Check if user has a saved theme preference or use system preference
  const getInitialMode = () => {
    // Check if we're in the browser and localStorage is available
    if (typeof window !== 'undefined' && window.localStorage) {
      // Look for a saved theme in localStorage
      const storedMode = window.localStorage.getItem('darkMode');
      if (storedMode !== null) {
        return JSON.parse(storedMode);
      }

      // Check for system preference
      const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
      if (userMedia.matches) {
        return true;
      }
    }

    // Default to light mode
    return false;
  };

  // Initialize state with the determined dark mode preference
  const [darkMode, setDarkMode] = useState(getInitialMode);

  // Apply dark mode class to document
  useEffect(() => {
    const root = window.document.documentElement;
    
    if (darkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Toggle dark mode function
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  // Context value
  const value = {
    darkMode,
    toggleDarkMode
  };

  return (
    <DarkModeContext.Provider value={value}>
      {children}
    </DarkModeContext.Provider>
  );
};

// Custom hook to use the dark mode context
export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
};

export default DarkModeContext;