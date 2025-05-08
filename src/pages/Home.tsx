import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDownIcon } from 'lucide-react';
import Navbar from '../components/Navbar';
import HomePage from '../components/HomPage';
import Spinner from '../components/Spinner';

const Home: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Handle scroll for shadow and scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Simulate initial page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Mocked 1-second load time
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Spinner for initial load */}
      {isLoading && <Spinner loading={true} variant="fullscreen" />}

      {/* Navbar */}
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 ${isScrolled ? 'shadow-md' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Navbar />
      </motion.header>

      {/* Main Content */}
      <motion.main
        className="flex-1 pt-16" // Padding to account for fixed navbar
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
    </div>
  );
};

export default Home;