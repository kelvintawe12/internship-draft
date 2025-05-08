import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
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
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isAdmin: false,
  user: null,
  loading: false,
  login: async () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for stored token on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          // Mock API call to verify token
          const response = await axios.get('/api/auth/verify', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data.user);
          setIsAuthenticated(true);
          setIsAdmin(response.data.user.role === 'admin');
        } catch (error) {
          localStorage.removeItem('authToken');
          toast.error('Session expired. Please sign in again.');
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean) => {
    setLoading(true);
    try {
      // Mock API call to login
      const response = await axios.post('/api/login', { email, password });
      const { token, user } = response.data;
      setUser(user);
      setIsAuthenticated(true);
      setIsAdmin(user.role === 'admin');
      if (rememberMe) {
        localStorage.setItem('authToken', token);
      }
      toast.success(`Welcome, ${user.name}!`);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      // Mock API call to logout
      await axios.post('/api/logout', {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });
      localStorage.removeItem('authToken');
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      toast.success('Logged out successfully.');
    } catch (error) {
      toast.error('Logout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};