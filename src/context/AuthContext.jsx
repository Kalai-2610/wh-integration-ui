import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { userService } from '../services/dataServices';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      localStorage.removeItem('user');
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/v1/sign_in', { email, password });
      if (response.data.success) {
        // Handle both nested and flat response structures
        const responseData = response.data.data || response.data;
        const token = responseData.access_token;
        const userData = responseData.userId;
        const sessionId = responseData.sessionId;
        const isSystem = responseData.isSystem;

        if (token) {
          localStorage.setItem('token', token);
          localStorage.setItem('sessionId', sessionId);
          localStorage.setItem('isSystem', isSystem);
          
          try {
            const userDetailsReq = await userService.getById(userData);
            if (userDetailsReq.data?.success) {
              const fullUser = userDetailsReq.data.data;
              localStorage.setItem('user', JSON.stringify(fullUser));
              setUser(fullUser);
            } else {
              localStorage.setItem('user', JSON.stringify({ _id: userData }));
              setUser({ _id: userData });
            }
          } catch (e) {
            console.error('Failed to fetch user details', e);
            localStorage.setItem('user', JSON.stringify({ _id: userData }));
            setUser({ _id: userData });
          }
          
          return { success: true };
        }
        return { success: false, error: 'Authentication failed: Missing token in response.' };
      }
      return { success: false, error: response.data.error || response.data.message || 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Login failed. Please check your credentials.';
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('sessionId');
    localStorage.removeItem('isSystem');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
