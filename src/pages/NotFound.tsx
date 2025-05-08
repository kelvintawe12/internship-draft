import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircleIcon } from 'lucide-react';

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
          Page Not Found
        </h1>
        <p className="text-lg md:text-xl mb-6">
          The page you’re looking for doesn’t exist
        </p>
      </div>
    </motion.section>
  );
};

const NotFound: React.FC = () => {
  return (
    <>
      <HeroSection />
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="max-w-md mx-auto bg-white shadow-md rounded-lg p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AlertCircleIcon size={48} className="mx-auto text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Oops! Something Went Wrong
            </h2>
            <p className="text-gray-600 mb-6">
              The page you’re trying to access may have been moved or deleted.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/"
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
                aria-label="Go to Home"
              >
                Go to Home
              </Link>
              <Link
                to="/contact"
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-500"
                aria-label="Contact Support"
              >
                Contact Support
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default NotFound;