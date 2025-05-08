import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MailIcon } from 'lucide-react';
import axios from 'axios';
import Spinner from '../components/Spinner';

interface ForgotPasswordForm {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    defaultValues: {
      email: '',
    },
  });

  const onSubmit: SubmitHandler<ForgotPasswordForm> = async (data) => {
    setIsLoading(true);
    try {
      // Mock API call for password reset
      await axios.post('/api/forgot-password', { email: data.email });
      toast.success('Password reset email sent! Check your inbox.', { theme: 'light' });
      setIsSubmitted(true);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send reset email. Please try again.', {
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
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          {isSubmitted ? 'Check Your Email' : 'Forgot Password'}
        </h2>
        {isSubmitted ? (
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              We've sent a password reset link to your email. Please check your inbox and follow the instructions.
            </p>
            <Link
              to="/signin"
              className="inline-block bg-indigo-600 text-white rounded-md py-3 px-6 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
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
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white rounded-md py-3 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:opacity-50 flex items-center justify-center transition"
              aria-label="Reset Password"
            >
              {isLoading && <Spinner loading={true} variant="inline" />}
              Reset Password
            </button>
          </form>
        )}
        {!isSubmitted && (
          <p className="mt-4 text-center text-sm text-gray-600">
            <Link to="/signin" className="text-indigo-600 hover:text-indigo-700 underline">
              Back to Sign In
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;