import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/api/authService';

// Create context with default values
const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  token: null,
  login: () => {},
  register: () => {},
  logout: () => {},
  checkAuthStatus: () => {}
});

// Provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage on component mount
  useEffect(() => {
    const initAuth = async () => {
      await checkAuthStatus();
      setIsLoading(false);
    };
    
    initAuth();
  }, []);
  
  // Check if user is logged in
  const checkAuthStatus = async () => {
    try {
      // First check if we have a token in localStorage
      const storedToken = localStorage.getItem('auth_token');
      
      if (!storedToken) {
        setIsAuthenticated(false);
        setUser(null);
        setToken(null);
        return false;
      }
      
      // Verify token with backend
      const response = await authService.checkLogin();
      
      if (response.logged_in && response.user) {
        setIsAuthenticated(true);
        setUser(response.user);
        setToken(storedToken);
        return true;
      } else {
        // Token is invalid or expired
        localStorage.removeItem('auth_token');
        setIsAuthenticated(false);
        setUser(null);
        setToken(null);
        return false;
      }
    } catch (error) {
      console.error('Error checking authentication status:', error);
      localStorage.removeItem('auth_token');
      setIsAuthenticated(false);
      setUser(null);
      setToken(null);
      return false;
    }
  };
  
  // Login user
  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      
      if (response.token && response.user) {
        localStorage.setItem('auth_token', response.token);
        setIsAuthenticated(true);
        setUser(response.user);
        setToken(response.token);
        return { success: true, user: response.user };
      }
      
      return { success: false, error: 'Invalid login response' };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Login failed. Please check your credentials and try again.' 
      };
    }
  };
  
  // Register user
  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      
      if (response.access_token && response.user) {
        localStorage.setItem('auth_token', response.access_token);
        setIsAuthenticated(true);
        setUser(response.user);
        setToken(response.access_token);
        return { success: true, user: response.user };
      }
      
      return { success: false, error: 'Invalid registration response' };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Registration failed. Please try again.' 
      };
    }
  };
  
  // Logout user
  const logout = () => {
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    return { success: true };
  };
  
  // Context value
  const contextValue = {
    isAuthenticated,
    user,
    token,
    login,
    register,
    logout,
    checkAuthStatus,
    isLoading
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export default AuthContext;