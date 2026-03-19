// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';

// Create the AuthContext with default values
const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if there is stored user data AND access token
    const storedUser = sessionStorage.getItem('user');
    const accessToken = sessionStorage.getItem('access_token');

    if (storedUser && accessToken) {
      try {
        const parsed = JSON.parse(storedUser);
        // Verify the stored user has admin role
        if (parsed.role === 'admin') {
          setUser(parsed);
          setIsAuthenticated(true);
        } else {
          sessionStorage.removeItem('user');
          sessionStorage.removeItem('access_token');
        }
      } catch (error) {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('access_token');
      }
    } else {
      // Clear partial auth data if either is missing
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('access_token');
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    // Only allow admin role to log in to the console
    if (userData.role !== 'admin') {
      throw new Error('Access denied: admin role required');
    }
    // Strip sensitive fields before storing
    const safeUser = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      businessName: userData.businessName,
    };
    setUser(safeUser);
    setIsAuthenticated(true);
    sessionStorage.setItem('user', JSON.stringify(safeUser));
    setLoading(false)
  };

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('access_token');
    setLoading(false);
  }, []);

  // Set up axios interceptor to handle 401 (session expired) responses
  useEffect(() => {
    const interceptorId = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          sessionStorage.removeItem('access_token');
          sessionStorage.removeItem('user');
          setUser(null);
          setIsAuthenticated(false);

          if (window.location.pathname !== '/') {
            window.location.href = '/';
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptorId);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
