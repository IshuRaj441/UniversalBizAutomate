import { login, register, getUserProfile } from './api';
import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import config from './config';

interface User {
  id: number;
  email: string;
  credits: number;
  is_admin: boolean;
}

type AuthResponse = {
  token: string;
  user: User;
};

// Save user data to localStorage
export const saveUser = (userData: AuthResponse) => {
  if (userData?.token) {
    localStorage.setItem(config.auth.tokenKey, userData.token);
    localStorage.setItem(config.auth.userKey, JSON.stringify(userData.user));
  }
};

// Get current user from localStorage
export const getCurrentUserFromStorage = (): User | null => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem(config.auth.userKey);
  return user ? JSON.parse(user) as User : null;
};

// Get auth token
export const getToken = (): string | null => {
  return localStorage.getItem(config.auth.tokenKey);
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// Check if user is admin
export const isAdmin = (): boolean => {
  const user = getCurrentUserFromStorage();
  return user?.is_admin === true;
};

// Login user
export const loginUser = async (email: string, password: string): Promise<User> => {
  const response = await login(email, password) as AuthResponse;
  saveUser(response);
  return response.user;
};

// Register new user
export const registerUser = async (email: string, password: string): Promise<User> => {
  const response = await register(email, password) as AuthResponse;
  saveUser(response);
  return response.user;
};

// Logout user
export const logout = (navigate?: (path: string) => void): void => {
  localStorage.removeItem(config.auth.tokenKey);
  localStorage.removeItem(config.auth.userKey);
  if (navigate) {
    navigate('/login');
  } else {
    window.location.href = '/login';
  }
};

// Get user profile with fresh data from server
export const fetchUserProfile = async () => {
  try {
    const user = await getUserProfile();
    if (user) {
      localStorage.setItem(config.auth.userKey, JSON.stringify(user));
    }
    return user;
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    logout();
    return null;
  }
};

// Higher-order component for protected routes
type WithAuthProps = {
  user: User | null;
  [key: string]: any;
};

export const withAuth = <P extends object>(
  Component: React.ComponentType<P & { user: User | null }>
): React.FC<P> => {
  const WithAuth: React.FC<P> = (props) => {
    const [isLoading, setIsLoading] = React.useState(true);
    const [user, setUser] = React.useState<User | null>(null);
    const navigate = useNavigate();

    React.useEffect(() => {
      const checkAuth = async () => {
        if (!isAuthenticated()) {
          navigate('/login');
          return;
        }
        
        try {
          const userData = await fetchUserProfile();
          if (userData) {
            setUser(userData);
          }
        } catch (error) {
          console.error('Authentication error:', error);
          logout(navigate);
        } finally {
          setIsLoading(false);
        }
      };

      checkAuth();
    }, [navigate]);

    if (isLoading) {
      return React.createElement('div', null, 'Loading...');
    }

    return React.createElement(Component, { ...props as P, user });
  };
  
  // Set display name for debugging
  const componentName = (Component as any).displayName || (Component as any).name || 'Component';
  (WithAuth as any).displayName = `withAuth(${componentName})`;
  
  return WithAuth;
};
