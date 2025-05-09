import React, { useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';

const VerifyEmail: React.FC = () => {
  const { verifyEmail } = useContext(AuthContext);
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      verifyEmail(token)
        .then(() => {
          setTimeout(() => navigate('/signin'), 3000);
        })
        .catch(() => {
          setTimeout(() => navigate('/signin'), 3000);
        });
    }
  }, [token, verifyEmail, navigate]);

  return (
    <motion.section
      className="py-16 bg-gray-100 min-h-screen flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-md w-full mx-auto px-4">
        <motion.div
          className="bg-white shadow-md rounded-lg p-8 text-center"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Verifying Your Email</h2>
          <p className="text-sm text-gray-600">
            Please wait while we verify your email. You will be redirected shortly.
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default VerifyEmail;