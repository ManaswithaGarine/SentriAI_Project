// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // Changed to false - no auto-login check
  const [error, setError] = useState(null);

  // REMOVED automatic login check - user must manually login each time
  // If you want to restore auto-login later, uncomment the useEffect below
  /*
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('sentriai_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('sentriai_user');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);
  */

  const login = async (credentials) => {
    setLoading(true);
    setError(null);

    try {
      // Mock login - accepts any email/password for demo
      if (credentials.email && credentials.password) {
        const mockUser = {
          id: '1',
          name: 'Admin User',
          email: credentials.email,
          role: 'admin'
        };
        
        // Save to localStorage (optional - remove this line if you don't want persistence)
        localStorage.setItem('sentriai_user', JSON.stringify(mockUser));
        setUser(mockUser);
        
        return { success: true, user: mockUser };
      } else {
        throw new Error('Email and password are required');
      }
    } catch (err) {
      const errorMsg = err.message || 'Login failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('sentriai_user');
    setUser(null);
    window.location.href = '/';
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
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

export default AuthContext;