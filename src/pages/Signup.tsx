import React, { useState, useContext, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { EyeIcon, EyeOffIcon, LockIcon, UserIcon, CheckCircleIcon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import axios from 'axios';

interface SignUpForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

const SignUp: React.FC = () => {
  const { login, isAuthenticated, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignUpForm>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  // Watch password for confirmPassword validation
  const password = watch('password');

  // Redirect authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      navigate(isAdmin ? '/dashboard' : '/order', { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const onSubmit: SubmitHandler<SignUpForm> = async (data) => {
    setIsLoading(true);
    try {
      // Mock API call for signup
      const response = await axios.post('/api/signup', {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      const { token, user } = response.data;

      // Auto-login after signup
      await login(data.email, data.password, false); // No rememberMe for signup
      toast.success(`Welcome, ${user.name}! Your account has been created.`, { theme: 'light' });
      navigate(isAdmin ? '/dashboard' : '/order');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Sign up failed. Please try again.', {
        theme: 'light',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8 border border-gray-200">
        {/* Text-based Logo */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-600">Mount Meru SoyCo</h1>
          <p className="text-sm text-gray-500">Quality Cooking Oils</p>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Create an Account</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <UserIcon size={16} className="mr-2 text-indigo-600" />
              Full Name
            </label>
            <input
              type="text"
              {...register('name', {
                required: 'Full name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters long',
                },
              })}
              className="w-full border border-gray-300 rounded-md p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
              aria-invalid={errors.name ? 'true' : 'false'}
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1" role="alert">
                {errors.name.message}
              </p>
            )}
          </div>
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
              placeholder="yourname@domain.rw"
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
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <LockIcon size={16} className="mr-2 text-indigo-600" />
              Confirm Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match',
              })}
              className="w-full border border-gray-300 rounded-md p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
              aria-invalid={errors.confirmPassword ? 'true' : 'false'}
              placeholder="********"
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1" role="alert">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <div>
            <label className="flex items-center space-x-2 text-sm text-gray-700">
              <input
                type="checkbox"
                {...register('terms', {
                  required: 'You must agree to the terms and conditions',
                })}
                className="border-gray-300 rounded focus:ring-indigo-600"
              />
              <span>
                I agree to the{' '}
                <Link to="/terms" className="text-indigo-600 hover:text-indigo-700 underline">
                  Terms and Conditions
                </Link>
              </span>
            </label>
            {errors.terms && (
              <p className="text-xs text-red-500 mt-1" role="alert">
                {errors.terms.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white rounded-md py-3 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:opacity-50 flex items-center justify-center transition"
            aria-label="Sign Up"
          >
            {isLoading && <Spinner loading={true} variant="inline" />}
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/signin" className="text-indigo-600 hover:text-indigo-700 underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;