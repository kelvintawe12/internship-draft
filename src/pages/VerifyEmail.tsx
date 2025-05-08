import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import axios from 'axios';

const VerifyEmail: React.FC = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
      return;
    }

    const verifyEmail = async () => {
      if (!token) {
        setError('Invalid verification link.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.post('/api/verify-email', { token });
        const { user, token: authToken } = response.data;

        localStorage.setItem('authToken', authToken);
        localStorage.setItem('userRole', user.role);

        toast.success(`Welcome, ${user.email}! Your email has been verified.`, {
          theme: 'light',
        });
        setIsVerified(true);
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 2000);
      } catch (error: any) {
        const message = error.response?.data?.message || 'Failed to verify email. The link may be invalid or expired.';
        setError(message);
        toast.error(message, { theme: 'light' });
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [token, navigate, isAuthenticated]);

  return (
    <motion.section
      className="py-16 bg-gray-100 min-h-screen flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="max-w-md w-full bg-white shadow-md rounded-lg p-8 border border-gray-200"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-600">Mount Meru SoyCo</h1>
          <p className="text-sm text-gray-500">Quality Cooking Oils</p>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Verify Your Email</h2>
        <div className="text-center space-y-4">
          {isLoading ? (
            <div role="status" aria-live="polite">
              <Spinner loading={true} variant="inline" />
              <p className="text-gray-600 mt-2">Verifying your email...</p>
            </div>
          ) : isVerified ? (
            <div role="status" aria-live="polite">
              <CheckCircle size={48} className="mx-auto text-green-500" aria-hidden="true" />
              <p className="text-gray-600">
                Your email has been successfully verified! You will be redirected to sign in shortly.
              </p>
              <Link
                to="/signin"
                className="inline-block text-indigo-600 hover:underline"
                aria-label="Back to Sign In"
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            <div role="alert" aria-live="assertive">
              <XCircle size={48} className="mx-auto text-red-500" aria-hidden="true" />
              <p className="text-gray-600">{error}</p>
              <Link
                to="/signup"
                className="inline-block bg-indigo-600 text-white rounded-lg py-3 px-6 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 transition"
                aria-label="Try Again"
              >
                Try Again
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </motion.section>
  );
};

export default VerifyEmail;