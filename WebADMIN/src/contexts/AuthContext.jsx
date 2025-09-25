import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔍 AuthContext: Checking authentication state...');
    
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');
    
    console.log('🔑 AuthContext: Token exists:', !!token);
    console.log('👤 AuthContext: User data exists:', !!userData);
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log('✅ AuthContext: User authenticated:', parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('❌ AuthContext: Error parsing user data:', error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
      }
    } else {
      console.log('❌ AuthContext: No authentication data found');
    }
    
    setLoading(false);
  }, []);

  const login = (userData) => {
    console.log('🔐 AuthContext: Login called with:', userData);
    setUser(userData);
  };

  const logout = () => {
    console.log('🚪 AuthContext: Logout called');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user // Thêm property này
  };

  console.log(' AuthContext: Rendering with state:', { user: !!user, loading });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
