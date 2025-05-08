import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { LanguagesIcon, ArrowRightIcon, ChevronDownIcon, LeafIcon, TruckIcon, UsersIcon } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';
import Logo from '../components/Logo';

const Home: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const controls = useAnimation();

  // Handle scroll for header shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animate hero on mount
  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    });
  }, [controls]);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'rw' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Header */}
      <motion.header
        className={`fixed top-0 left-0 right-0 px-4 md:px-6 py-4 border-b border-black/10 bg-white z-50 transition-shadow duration-300 ${isScrolled ? 'shadow-md' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" aria-label={t('home.logo_alt')}>
            <Logo className="h-10 w-auto" />
          </Link>
          <nav className="flex items-center space-x-4">
            <button
              onClick={toggleLanguage}
              className="flex items-center text-black hover:text-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-md p-2 transition-colors duration-200"
              aria-label={t('home.toggle_language')}
            >
              <LanguagesIcon size={20} className="mr-1" />
              <span className="text-sm font-medium">{i18n.language === 'en' ? 'EN' : 'RW'}</span>
            </button>
            <Link
              to="/signin"
              className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 transform hover:scale-105"
            >
              {t('home.sign_in')}
            </Link>
          </nav>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center pt-24 pb-12 md:pt-32 md:pb-20 bg-gradient-to-b from-white to-gray-50">
        <motion.div
          className="max-w-4xl mx-auto px-4 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={controls}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-black mb-6 leading-tight">
            {t('home.title')}
          </h1>
          <p className="text-lg md:text-2xl text-black/70 mb-10 max-w-2xl mx-auto">
            {t('home.subtitle')}
          </p>
          <Link
            to="/signin"
            className="inline-flex items-center bg-orange-500 text-white px-8 py-4 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg font-medium transition-all duration-200 transform hover:scale-105"
          >
            {t('home.get_started')}
            <ArrowRightIcon size={24} className="ml-2" />
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-black text-center mb-12">
            {t('home.features.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="bg-gray-50 p-6 rounded-lg border border-black/10 text-center"
              whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
              transition={{ duration: 0.3 }}
            >
              <LeafIcon size={40} className="text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-black mb-2">
                {t('home.features.sustainability')}
              </h3>
              <p className="text-black/70">
                {t('home.features.sustainability_desc')}
              </p>
            </motion.div>
            <motion.div
              className="bg-gray-50 p-6 rounded-lg border border-black/10 text-center"
              whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
              transition={{ duration: 0.3 }}
            >
              <TruckIcon size={40} className="text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-black mb-2">
                {t('home.features.efficiency')}
              </h3>
              <p className="text-black/70">
                {t('home.features.efficiency_desc')}
              </p>
            </motion.div>
            <motion.div
              className="bg-gray-50 p-6 rounded-lg border border-black/10 text-center"
              whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
              transition={{ duration: 0.3 }}
            >
              <UsersIcon size={40} className="text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-black mb-2">
                {t('home.features.community')}
              </h3>
              <p className="text-black/70">
                {t('home.features.community_desc')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
            {t('home.cta.title')}
          </h2>
          <p className="text-lg md:text-xl text-black/70 mb-8">
            {t('home.cta.subtitle')}
          </p>
          <Link
            to="/signin"
            className="inline-flex items-center bg-orange-500 text-white px-8 py-4 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg font-medium transition-all duration-200 transform hover:scale-105"
          >
            {t('home.cta.button')}
            <ArrowRightIcon size={24} className="ml-2" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 md:px-6 border-t border-black/10 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-black/70">
          <div>
            <h3 className="text-lg font-semibold text-black mb-4">{t('home.footer.about')}</h3>
            <p>{t('home.footer.about_desc')}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-black mb-4">{t('home.footer.links')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-orange-500">
                  {t('home.about')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-orange-500">
                  {t('home.contact')}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-orange-500">
                  {t('home.privacy')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-black mb-4">{t('home.footer.contact')}</h3>
            <p>{t('home.footer.contact_desc')}</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 flex flex-col md:flex-row justify-between items-center text-sm text-black/70 border-t border-black/10 pt-4">
          <p>{t('home.copyright')}</p>
          <p className="mt-2 md:mt-0">v1.0.0</p>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <motion.button
        className="fixed bottom-6 right-6 bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        animate={{ opacity: isScrolled ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        aria-label={t('home.scroll_to_top')}
      >
        <ChevronDownIcon size={24} className="rotate-180" />
      </motion.button>
    </div>
  );
};

export default Home;