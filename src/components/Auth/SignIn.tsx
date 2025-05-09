import React, { useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Lock, Mail } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { setUser } from '../../store/userSlice';

interface SignInForm {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const { isAuthenticated, login, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignInForm>({ defaultValues: { email: '', password: '' } });

  useEffect(() => {
    if (isAuthenticated) {
      navigate(isAdmin ? '/admin-dashboard' : '/dashboard');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const onSubmit: SubmitHandler<SignInForm> = async (data) => {
    try {
      await login(data.email, data.password);
      // Dispatch user data to Redux
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      dispatch(
        setUser({
          id: user.id || data.email.split('@')[0],
          username: data.email.split('@')[0],
          fullName: user.name || 'User',
          email: user.email,
          avatar: 'https://example.com/avatar.jpg',
          bio: 'Logged in user',
          joinedDate: new Date().toISOString(),
          role: user.role,
        })
      );
      reset();
      navigate(user.role === 'admin' ? '/admin-dashboard' : '/dashboard');
    } catch (error) {
      // Error handled by AuthContext
    }
  };

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
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Sign In</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  type="password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                  })}
                  className="w-full border border-gray-300 rounded-lg pl-10 p-3 focus:ring-2 focus:ring-indigo-500 text-sm"
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
            <motion.button
              type="submit"
              disabled={false} // Loading handled by AuthContext
              className="w-full bg-indigo-600 text-white py-3 rounded-lg text-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Sign In"
            >
              Sign In
            </motion.button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-indigo-600 hover:underline" aria-label="Sign Up">
              Sign Up
            </Link>
            <br />
            Forgot your password?{' '}
            <Link to="/forgot-password" className="text-indigo-600 hover:underline" aria-label="Forgot Password">
              Reset Password
            </Link>
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default SignIn;