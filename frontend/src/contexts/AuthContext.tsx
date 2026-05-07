import React, { createContext, useContext, useState, useEffect } from 'react';
import { register as apiRegister, login as apiLogin, getCurrentUser } from '../api/auth';
import config from '../config';

interface User {
  id: number;
  email: string;
  credits: number;
  is_admin: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem(config.auth.tokenKey));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Handle token storage
  useEffect(() => {
    if (token) {
      localStorage.setItem(config.auth.tokenKey, token);
    } else {
      localStorage.removeItem(config.auth.tokenKey);
    }
  }, [token]);

  // Load user data when token changes
  useEffect(() => {
    let isMounted = true;
    
    const loadUser = async () => {
      if (token) {
        try {
          const userData = await getCurrentUser(token);
          if (isMounted) {
            setUser(userData);
          }
        } catch (err) {
          if (isMounted) {
            console.error('Failed to load user', err);
            setToken(null);
          }
        }
      }
      if (isMounted) {
        setLoading(false);
      }
    };

    loadUser();
    
    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleAuthResponse = (response: any) => {
    setToken(response.token);
    setUser(response.user);
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiLogin(email, password);
      handleAuthResponse(response);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiRegister(email, password);
      handleAuthResponse(response);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(config.auth.tokenKey);
    localStorage.removeItem(config.auth.userKey);
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};