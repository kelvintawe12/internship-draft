import React, { useContext } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

interface ForgotPasswordForm {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const { forgotPassword } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordForm>({ defaultValues: { email: '' } });

  const onSubmit: SubmitHandler<ForgotPasswordForm> = async (data) => {
    try {
      await forgotPassword(data.email);
      reset();
      setTimeout(() => navigate('/signin'), 3000);
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
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Reset Password</h2>
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
            <motion.button
              type="submit"
              disabled={false} // Loading handled by AuthContext
              className="w-full bg-indigo-600 text-white py-3 rounded-lg text-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Send Reset Link"
            >
              Send Reset Link
            </motion.button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-6">
            Remember your password?{' '}
            <Link to="/signin" className="text-indigo-600 hover:underline" aria-label="Sign In">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ForgotPassword;