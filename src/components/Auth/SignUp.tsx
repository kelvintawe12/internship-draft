import React, { useEffect, useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Lock, Mail, User, Eye, EyeOff } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { setUser } from '../../store/userSlice';

interface SignUpForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'user' | 'admin';
}

const SignUp: React.FC = () => {
  const { isAuthenticated, signup, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<SignUpForm>({ defaultValues: { name: '', email: '', password: '', confirmPassword: '', role: 'user' } });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(isAdmin ? '/admin-dashboard' : '/dashboard');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const onSubmit: SubmitHandler<SignUpForm> = async (data) => {
    try {
      await signup(data.name, data.email, data.password, data.role);
      dispatch(
        setUser({
          id: data.email.split('@')[0], // Temporary ID until API provides one
          username: data.email.split('@')[0],
          fullName: data.name,
          email: data.email,
          avatar: 'https://example.com/avatar.jpg',
          bio: 'New user',
          joinedDate: new Date().toISOString(),
          role: data.role,
        })
      );
      reset();
      navigate(data.role === 'admin' ? '/admin-dashboard' : '/dashboard');
    } catch (error) {
      // Error handled by AuthContext
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
                  className="w-full border border-gray-300 rounded-lg pl-10 p-3 focus:ring-2 focus:ring-indigo-500 text-sm"
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
                  className="w-full border border-gray-300 rounded-lg pl-10 p-3 focus:ring-2 focus:ring-indigo-500 text-sm"
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
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                  })}
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-10 p-3 focus:ring-2 focus:ring-indigo-500 text-sm"
                  placeholder="Password"
                  aria-invalid={errors.password ? 'true' : 'false'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-indigo-600 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
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
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) => value === password || 'Passwords do not match',
                  })}
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-10 p-3 focus:ring-2 focus:ring-indigo-500 text-sm"
                  placeholder="Confirm Password"
                  aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-indigo-600 focus:outline-none"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1" role="alert">
                  {errors.confirmPassword.message}
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
                className="w-full border border-gray-300 rounded-md p-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <motion.button
              type="submit"
              disabled={false} // Loading handled by AuthContext
              className="w-full bg-indigo-600 text-white py-3 rounded-lg text-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Sign Up"
            >
              Sign Up
            </motion.button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-6">
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
