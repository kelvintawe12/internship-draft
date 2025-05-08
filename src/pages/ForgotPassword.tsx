import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MailIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';

interface ForgotPasswordForm {
  email: string;
}

const HeroSection: React.FC = () => {
  return (
    <motion.section
      className="bg-indigo-600 text-white py-12"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Reset Your Password
        </h1>
        <p className="text-lg md:text-xl mb-6">
          Enter your email to receive a password reset link
        </p>
      </div>
    </motion.section>
  );
};

const ForgotPassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordForm>({
    defaultValues: { email: '' },
  });

  const onSubmit: SubmitHandler<ForgotPasswordForm> = async (data) => {
    setIsLoading(true);
    try {
      await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      });
      toast.success('Password reset link sent! Check your email.', { theme: 'light' });
      setIsSubmitted(true);
      reset();
    } catch (error: any) {
      toast.error('Failed to send reset link. Please try again.', { theme: 'light' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <HeroSection />
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="max-w-md mx-auto bg-white shadow-md rounded-lg p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
              {isSubmitted ? 'Check Your Email' : 'Reset Password'}
            </h2>
            {isSubmitted ? (
              <div className="text-center space-y-4">
                <p className="text-gray-600">
                  A password reset link has been sent to your email.
                </p>
                <Link
                  to="/signin"
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
                  aria-label="Back to Sign In"
                >
                  Back to Sign In
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <MailIcon size={16} className="mr-2 text-indigo-600" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Invalid email address',
                      },
                    })}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
                    aria-invalid={errors.email ? 'true' : 'false'}
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1" role="alert">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 flex items-center justify-center"
                  aria-label="Send Reset Link"
                >
                  {isLoading && <Spinner loading={true} variant="inline" />}
                  Send Reset Link
                </button>
              </form>
            )}
            {!isSubmitted && (
              <p className="mt-4 text-center text-sm text-gray-600">
                Remember your password?{' '}
                <Link
                  to="/signin"
                  className="text-indigo-600 hover:text-indigo-700 underline"
                >
                  Sign In
                </Link>
              </p>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default ForgotPassword;