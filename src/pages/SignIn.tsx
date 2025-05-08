import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { EyeIcon, EyeOffIcon, LockIcon, UserIcon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import Logo from '../components/Logo';

interface SignInForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

const SignIn: React.FC = () => {
  const { t } = useTranslation();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit: SubmitHandler<SignInForm> = async (data) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password, data.rememberMe);
      toast.success(t('signin.success'), { theme: 'light' });
      navigate('/dashboard');
    } catch (error) {
      toast.error(t('signin.error'), { theme: 'light' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6 border border-black/10">
        <Logo />
        <h2 className="text-2xl font-bold text-black text-center mb-6">
          {t('signin.title')}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="flex items-center text-sm font-medium text-black/70 mb-1">
              <UserIcon size={16} className="mr-1" />
              {t('signin.email')}
            </label>
            <input
              type="email"
              {...register('email', {
                required: t('signin.email_required'),
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: t('signin.email_invalid'),
                },
              })}
              className="w-full border border-black/20 rounded-md p-2 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-invalid={errors.email ? 'true' : 'false'}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="flex items-center text-sm font-medium text-black/70 mb-1">
              <LockIcon size={16} className="mr-1" />
              {t('signin.password')}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password', {
                  required: t('signin.password_required'),
                  minLength: {
                    value: 8,
                    message: t('signin.password_min'),
                  },
                })}
                className="w-full border border-black/20 rounded-md p-2 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                aria-invalid={errors.password ? 'true' : 'false'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-black/70 hover:text-orange-500 focus:outline-none"
                aria-label={t('signin.toggle_password')}
              >
                {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>
          <div className="flex justify-between items-center">
            <label className="flex items-center space-x-2 text-sm text-black/70">
              <input
                type="checkbox"
                {...register('rememberMe')}
                className="border-black/20 focus:ring-orange-500"
              />
              <span>{t('signin.remember_me')}</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              {t('signin.forgot_password')}
            </Link>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-500 text-white rounded-md py-2 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 flex items-center justify-center"
          >
            {isLoading && <Spinner />}
            {t('signin.submit')}
          </button>
        </form>
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

export default SignIn;