import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDownIcon } from 'lucide-react';
import MainLayout from '../components/MainLayout';
import HomePage from '../components/HomPage';

const Home: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll for shadow and scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <MainLayout>
      {/* Main Content */}
      <motion.main
        className="flex-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <HomePage />
      </motion.main>

      {/* Scroll to Top Button */}
      <motion.button
        className="fixed bottom-6 right-6 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        animate={{ opacity: isScrolled ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        aria-label="Scroll to top"
      >
        <ChevronDownIcon size={24} className="rotate-180" />
      </motion.button>
    </MainLayout>
  );
};

export default Home;
