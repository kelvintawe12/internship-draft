import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileTextIcon } from 'lucide-react';

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
          Terms and Conditions
        </h1>
        <p className="text-lg md:text-xl mb-6">
          Understand the rules governing your use of Mount Meru SoyCo services
        </p>
        <Link
          to="/contact"
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg text-lg focus:ring-2 focus:ring-green-500"
          aria-label="Contact Us"
        >
          Contact Us
        </Link>
      </div>
    </motion.section>
  );
};

const Terms: React.FC = () => {
  return (
    <>
      <HeroSection />
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Terms</h2>
          <div className="space-y-8">
            <motion.div
              className="bg-white shadow-md rounded-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FileTextIcon className="mr-2 text-indigo-600" />
                1. Introduction
              </h3>
              <p className="text-gray-600">
                These terms govern your use of Mount Meru SoyCo’s website and services. By accessing our platform, you agree to comply with these terms. If you disagree, please refrain from using our services.
              </p>
            </motion.div>
            <motion.div
              className="bg-white shadow-md rounded-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FileTextIcon className="mr-2 text-indigo-600" />
                2. Account Registration
              </h3>
              <p className="text-gray-600">
                You must register an account to place orders. You are responsible for safeguarding your account credentials and notifying us of any unauthorized access. We reserve the right to suspend accounts for policy violations.
              </p>
            </motion.div>
            <motion.div
              className="bg-white shadow-md rounded-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FileTextIcon className="mr-2 text-indigo-600" />
                3. Orders and Payments
              </h3>
              <p className="text-gray-600">
                Orders are subject to availability. Prices are in RWF and include taxes. Payments are processed at checkout. We may cancel orders due to pricing errors or stock issues, with full refunds issued.
              </p>
            </motion.div>
            <motion.div
              className="bg-white shadow-md rounded-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FileTextIcon className="mr-2 text-indigo-600" />
                4. Shipping and Delivery
              </h3>
              <p className="text-gray-600">
                Delivery times are estimates and may vary. You must provide accurate delivery details. We are not liable for delays caused by external factors, but we’ll keep you informed.
              </p>
            </motion.div>
            <motion.div
              className="bg-white shadow-md rounded-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FileTextIcon className="mr-2 text-indigo-600" />
                5. Returns and Refunds
              </h3>
              <p className="text-gray-600">
                Returns are accepted within 7 days for unopened products in original condition. Refunds are processed within 14 days of return receipt. Contact us to initiate a return.
              </p>
            </motion.div>
            <motion.div
              className="bg-white shadow-md rounded-lg p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Questions?
              </h3>
              <p className="text-gray-600 mb-4">
                Reach out for clarification or support.
              </p>
              <Link
                to="/contact"
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
                aria-label="Contact Us"
              >
                Contact Us
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Terms;