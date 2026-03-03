import axios from 'axios';
import { API_BASE_URL } from '../config';

const api = axios.create({
  // Use relative URL in development to let Vite proxy handle port 3000 and avoid CORS
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const sessionId = localStorage.getItem('sessionId')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers.sessionId = sessionId;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiry and conditional logout
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const errorMessage = error.response?.data?.error || error.response?.data?.message || '';

    // Condition 1: Check if it's a "Token Expired" error that requires refresh
    if (errorMessage.toLowerCase().includes('token expired') && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Attempt to refresh the token using /auth/v1/refresh_token
        const response = await api.post('/auth/v1/refresh_token'); 
        if (response.data.success) {
          const responseData = response.data.data || response.data;
          const newToken = responseData.access_token;
          
          if (newToken) {
            localStorage.setItem('token', newToken);
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // If refresh fails, we'll fall through to potential logout check
      }
    }

    // Condition 2: Logout ONLY on specific fatal session/token errors
    const fatalErrors = ['Invalid Session', 'Invalid Token', 'Session Expired'];
    const shouldLogout = fatalErrors.some(msg => errorMessage.toLowerCase().includes(msg.toLowerCase()));

    if (shouldLogout) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
