import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Perform initial verification of token on app mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/api/auth/me');
          setUser(res.data);
        } catch (err) {
          console.error("Auth initialization failed:", err);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    initializeAuth();

    // Listen for logout events triggered by interceptor (e.g. 401 token expiration)
    const handleLogoutEvent = () => {
      setUser(null);
    };
    
    window.addEventListener('auth-logout', handleLogoutEvent);
    return () => {
      window.removeEventListener('auth-logout', handleLogoutEvent);
    };
  }, []);

  const login = async (usernameOrEmail, password) => {
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', { usernameOrEmail, password });
      const { token, id, username, email } = res.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ id, username, email }));
      
      setUser({ id, username, email });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/api/auth/register', { username, email, password });
      const { token, id, username: savedName, email: savedEmail } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ id, username: savedName, email: savedEmail }));

      setUser({ id, username: savedName, email: savedEmail });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
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
