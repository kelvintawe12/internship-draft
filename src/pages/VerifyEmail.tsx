import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CheckCircleIcon, XCircleIcon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import axios from 'axios';

const VerifyEmail: React.FC = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setError('Invalid verification link.');
        setIsLoading(false);
        return;
      }

      try {
        // Mock API call to verify email
        const response = await axios.post('/api/verify-email', { token });
        const { email, password, user } = response.data;

        // Auto-login after verification
        await login(email, password, false); // No rememberMe
        toast.success(`Welcome, ${user.name}! Your email has been verified.`, {
          theme: 'light',
        });
        setIsVerified(true);
        setTimeout(() => {
          navigate(user.role === 'admin' ? '/dashboard' : '/order', { replace: true });
        }, 2000);
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to verify email. The link may be invalid or expired.');
        toast.error(error.response?.data?.message || 'Verification failed.', { theme: 'light' });
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [token, login, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8 border border-gray-200">
        {/* Text-based Logo */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-600">Mount Meru SoyCo</h1>
          <p className="text-sm text-gray-500">Quality Cooking Oils</p>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Verify Your Email</h2>
        <div className="text-center space-y-4">
          {isLoading ? (
            <>
              <Spinner loading={true} variant="inline" />
              <p className="text-gray-600">Verifying your email...</p>
            </>
          ) : isVerified ? (
            <>
              <CheckCircleIcon size={48} className="mx-auto text-green-500" />
              <p className="text-gray-600">
                Your email has been successfully verified! You will be redirected shortly.
              </p>
              <Link
                to="/signin"
                className="inline-block text-indigo-600 hover:text-indigo-700 underline"
                aria-label="Back to Sign In"
              >
                Back to Sign In
              </Link>
            </>
          ) : (
            <>
              <XCircleIcon size={48} className="mx-auto text-red-500" />
              <p className="text-gray-600">{error}</p>
              <Link
                to="/signup"
                className="inline-block bg-indigo-600 text-white rounded-md py-3 px-6 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
                aria-label="Try Again"
              >
                Try Again
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;