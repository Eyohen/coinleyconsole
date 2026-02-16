// src/utils/axiosInstance.js
import axios from 'axios';
import { URL } from '../url';

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: URL,
});

// Request interceptor - add auth token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle 401 errors (session expired)
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Session expired or unauthorized
      console.log('Session expired - redirecting to login');

      // Clear auth data
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');

      // Redirect to login page
      // Using window.location ensures a full page reload which clears React state
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
