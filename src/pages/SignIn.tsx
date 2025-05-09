import React, { useState, useContext, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { EyeIcon, EyeOffIcon, LockIcon, UserIcon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import axios from 'axios';

interface SignInForm {
  email: string;
  password: string;
  rememberMe: boolean;
  role: 'user' | 'admin';
}

const SignIn: React.FC = () => {
  const { login, isAuthenticated, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendSent, setResendSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
      role: 'user',
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate(isAdmin ? '/dashboard' : '/order', { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleResendVerification = async (email: string) => {
    setIsLoading(true);
    try {
      await axios.post('/api/send-verification-email', { email });
      toast.success('Verification email resent! Please check your inbox.', { theme: 'light' });
      setResendSent(true);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to resend verification email.', {
        theme: 'light',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit: SubmitHandler<SignInForm> = async (data) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Signed in successfully!', { theme: 'light' });
      navigate(data.role === 'admin' ? '/dashboard' : '/order');
    } catch (error: any) {
      if (error.response?.data?.message === 'Email not verified') {
        toast.error('Please verify your email before signing in.', { theme: 'light' });
        setTimeout(() => handleResendVerification(data.email), 1000);
      } else {
        toast.error(error.response?.data?.message || 'Sign in failed. Please try again.', {
          theme: 'light',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8 border border-gray-200">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-600">Mount Meru SoyCo</h1>
          <p className="text-sm text-gray-500">Quality Cooking Oils</p>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Sign In</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <UserIcon size={16} className="mr-2 text-indigo-600" />
              Email Address
            </label>
            <input
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email address',
                },
                validate: (value) =>
                  value.includes('.rw') || 'Email must be a valid Rwandan domain (e.g., .rw)',
              })}
              className="w-full border border-gray-300 rounded-md p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
              aria-invalid={errors.email ? 'true' : 'false'}
              placeholder="email@example.com"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <LockIcon size={16} className="mr-2 text-indigo-600" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters long',
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                    message: 'Password must include uppercase, lowercase, and a number',
                  },
                })}
                className="w-full border border-gray-300 rounded-md p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
                aria-invalid={errors.password ? 'true' : 'false'}
                placeholder="********"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600 focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Select Role
            </label>
            <select
              id="role"
              {...register('role')}
              className="w-full border border-gray-300 rounded-md p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-between items-center">
            <label className="flex items-center space-x-2 text-sm text-gray-700">
              <input
                type="checkbox"
                {...register('rememberMe')}
                className="border-gray-300 rounded focus:ring-indigo-600"
              />
              <span>Remember me</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-sm text-indigo-600 hover:text-indigo-700 underline"
              aria-label="Forgot your password?"
            >
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white rounded-md py-3 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:opacity-50 flex items-center justify-center transition"
            aria-label="Sign In"
          >
            {isLoading && <Spinner loading={true} variant="inline" />}
            Sign In
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-indigo-600 hover:text-indigo-700 underline">
            Sign Up
          </Link>
        </p>
        {resendSent && (
          <p className="mt-2 text-center text-sm text-green-600">
            Verification email sent! Check your inbox.
          </p>
        )}
      </div>
    </div>
  );
};

export default SignIn;
