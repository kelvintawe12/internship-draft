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
  signup: (name: string, email: string, password: string, role: 'user' | 'admin') => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isAdmin: false,
  user: null,
  loading: true,
  signup: async () => {},
  login: async () => {},
  logout: async () => {},
  verifyEmail: async () => {},
  forgotPassword: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
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
        setIsAdmin(parsedUser.role === 'admin');
      }
    }
    setLoading(false);
  }, []);

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
      setIsAdmin(data.user.role === 'admin');
      toast.success('Sign up successful! Please check your email to verify.', { theme: 'light' });
    } catch (error) {
      toast.error('Failed to sign up. Please try again.', { theme: 'light' });
      throw error;
    } finally {
      setLoading(false);
    }
  };

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
      setIsAdmin(data.user.role === 'admin');
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
      setIsAdmin(false);
      toast.success('Logged out successfully!', { theme: 'light' });
    } catch (error) {
      toast.error('Failed to log out.', { theme: 'light' });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (token: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/verify-email/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      if (!response.ok) throw new Error('Failed to send reset link');
      toast.success('Password reset link sent to your email.', { theme: 'light' });
    } catch (error) {
      toast.error('Failed to send reset link.', { theme: 'light' });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, user, loading, signup, login, logout, verifyEmail, forgotPassword }}>
      {children}
    </AuthContext.Provider>
  );
};