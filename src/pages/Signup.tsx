import React, { useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Lock, Mail, User } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

interface SignUpForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUp: React.FC = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<SignUpForm>({ defaultValues: { name: '', email: '', password: '', confirmPassword: '' } });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit: SubmitHandler<SignUpForm> = async (data) => {
    try {
      const response = await axios.post('/api/signup', {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (!response.ok) {
        throw new Error('Signup failed');
      }

      toast.success('Sign up successful! Please check your email to verify your account.', {
        theme: 'light',
      });
      reset();
      navigate('/signin');
    } catch (error) {
      toast.error('Failed to sign up. Please try again.', { theme: 'light' });
    }
  };

  const password = watch('password');

  return (
    <motion.section
      className="py-16 bg-gray-100 min-h-screen flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-md w-full mx-auto px-4">
        <motion.div
          className="bg-white shadow-md rounded-lg p-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create an Account</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-600" size={20} />
                <input
                  id="name"
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  className="w-full border border-gray-300 rounded-lg pl-10 p-3 focus:ring-2 focus:ring-indigo-500"
                  placeholder="Full Name"
                  aria-invalid={errors.name ? 'true' : 'false'}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-red-500 mt-1" role="alert">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-600" size={20} />
                <input
                  id="email"
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Invalid email address',
                    },
                  })}
                  className="w-full border border-gray-300 rounded-lg pl-10 p-3 focus:ring-2 focus:ring-indigo-500"
                  placeholder="Email Address"
                  aria-invalid={errors.email ? 'true' : 'false'}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-600" size={20} />
                <input
                  id="password"
                  type="password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                  })}
                  className="w-full border border-gray-300 rounded-lg pl-10 p-3 focus:ring-2 focus:ring-indigo-500"
                  placeholder="Password"
                  aria-invalid={errors.password ? 'true' : 'false'}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1" role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-600" size={20} />
                <input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) => value === password || 'Passwords do not match',
                  })}
                  className="w-full border border-gray-300 rounded-lg pl-10 p-3 focus:ring-2 focus:ring-indigo-500"
                  placeholder="Confirm Password"
                  aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1" role="alert">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Sign Up"
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </motion.button>
          </form>
          <p className="text-center text-gray-600 mt-6">
            Already have an account?{' '}
            <Link to="/signin" className="text-indigo-600 hover:underline" aria-label="Sign In">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default SignUp;