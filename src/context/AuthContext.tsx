import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'react-toastify';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string; // Optional property for the user's avatar
  role: 'admin' | 'user';
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (name: string, email: string, password: string, role: 'user' | 'admin') => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>; // Add this property
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: false,
  isAdmin: false,
  login: async () => {},
  logout: async () => {},
  signup: async () => {},
  verifyEmail: async () => {},
  forgotPassword: async () => {}, // Add this property
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) throw new Error('Login failed');
      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      setIsAuthenticated(true);
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
      await fetch('/api/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Logged out successfully!', { theme: 'light' });
    } catch (error) {
      toast.error('Failed to log out.', { theme: 'light' });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, role: 'user' | 'admin') => {
    setLoading(true);
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      if (!response.ok) throw new Error('Signup failed');
      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      setIsAuthenticated(true);
      toast.success('Account created successfully!', { theme: 'light' });
    } catch (error) {
      toast.error('Failed to create account.', { theme: 'light' });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (token: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      if (!response.ok) throw new Error('Email verification failed');
      toast.success('Email verified successfully!', { theme: 'light' });
    } catch (error) {
      toast.error('Failed to verify email.', { theme: 'light' });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) throw new Error('Password reset failed');
      toast.success('Password reset email sent successfully!', { theme: 'light' });
    } catch (error) {
      toast.error('Failed to send password reset email.', { theme: 'light' });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, isAdmin: user?.role === 'admin', login, logout, signup, verifyEmail, forgotPassword }}>
      {children}
    </AuthContext.Provider>
  );
};