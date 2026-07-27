import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  // Setup Axios default headers when token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  // Load profile on initialization if token exists
  useEffect(() => {
    const loadProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/auth/profile`);
        setUser(res.data);
      } catch (error) {
        console.error('Failed to load user profile on init', error);
        // Clear invalid token
        setToken('');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data.user;
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Please check credentials.';
      throw new Error(msg);
    }
  };

  // Signup handler
  const signup = async (name, email, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/register`, { name, email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data.user;
    } catch (error) {
      const msg = error.response?.data?.message || 'Signup failed. Please try again.';
      throw new Error(msg);
    }
  };

  // Mock Google login handler
  const loginWithGoogle = async (name, email) => {
    try {
      const res = await axios.post(`${API_URL}/auth/google`, { name, email });
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data.user;
    } catch (error) {
      const msg = error.response?.data?.message || 'Google authentication failed.';
      throw new Error(msg);
    }
  };

  // Logout handler
  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
  };

  // Update preferences helper
  const updatePreferences = async (preferences) => {
    try {
      const res = await axios.put(`${API_URL}/auth/profile`, { preferences });
      setUser(res.data);
      return res.data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update preferences.';
      throw new Error(msg);
    }
  };

  // Update name helper
  const updateProfileName = async (name) => {
    try {
      const res = await axios.put(`${API_URL}/auth/profile`, { name });
      setUser(res.data);
      return res.data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update profile name.';
      throw new Error(msg);
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    signup,
    loginWithGoogle,
    logout,
    updatePreferences,
    updateProfileName
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
