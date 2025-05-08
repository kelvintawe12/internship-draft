import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MailIcon } from 'lucide-react';
import Logo from '../components/Logo';

interface ForgotPasswordForm {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

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
      // TODO: Implement actual forgot password API call here
      await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate async
      toast.success(t('forgotPassword.success'), { theme: 'light' });
    } catch (error) {
      toast.error(t('forgotPassword.error'), { theme: 'light' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6 border border-black/10">
        <Logo />
        <h2 className="text-2xl font-bold text-black text-center mb-6">
          {t('forgotPassword.title')}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="flex items-center text-sm font-medium text-black/70 mb-1">
              <MailIcon size={16} className="mr-1" />
              {t('forgotPassword.email')}
            </label>
            <input
              type="email"
              {...register('email', {
                required: t('forgotPassword.email_required'),
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: t('forgotPassword.email_invalid'),
                },
              })}
              className="w-full border border-black/20 rounded-md p-2 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-invalid={errors.email ? 'true' : 'false'}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-500 text-white rounded-md py-2 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 flex items-center justify-center"
          >
            {isLoading && <Spinner />}
            {t('forgotPassword.submit')}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-black/70">
          <Link to="/signin" className="text-blue-500 hover:text-blue-600">
            {t('forgotPassword.back_to_signin')}
          </Link>
        </p>
      </div>
    </div>
  );
};

// Spinner Component
const Spinner: React.FC = () => (
  <svg
    className="animate-spin h-5 w-5 mr-2 text-white"
    viewBox="0 0 24 24"
    aria-label="Loading"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

export default ForgotPassword;
