import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'react-toastify';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isAdmin: false,
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth token in localStorage on mount
    const token = localStorage.getItem('authToken');
    if (token) {
      // Mock: Simulate fetching user data
      const mockUser: User = {
        id: 'user123',
        name: 'User Name',
        email: 'user@example.com',
        role: localStorage.getItem('userRole') === 'admin' ? 'admin' : 'user',
      };
      setUser(mockUser);
      setIsAuthenticated(true);
      setIsAdmin(mockUser.role === 'admin');
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Mock API call
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      const { user: userData, token } = data;

      localStorage.setItem('authToken', token);
      localStorage.setItem('userRole', userData.role);

      setUser(userData);
      setIsAuthenticated(true);
      setIsAdmin(userData.role === 'admin');
      toast.success('Logged in successfully!', { theme: 'light' });
    } catch (error) {
      toast.error('Invalid email or password.', { theme: 'light' });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      // Mock API call
      await fetch('/api/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');

      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      toast.success('Logged out successfully!', { theme: 'light' });
    } catch (error) {
      toast.error('Failed to log out.', { theme: 'light' });
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    isAdmin,
    user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};