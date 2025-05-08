import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { HomeIcon } from 'lucide-react';
import Logo from '../components/Logo';

const NotFound: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <Logo />
      <h1 className="text-4xl md:text-6xl font-bold text-black mb-4">
        {t('notfound.title')}
      </h1>
      <p className="text-lg md:text-xl text-black/70 mb-8 text-center">
        {t('notfound.subtitle')}
      </p>
      <Link
        to="/"
        className="inline-flex items-center bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg"
      >
        <HomeIcon size={20} className="mr-2" />
        {t('notfound.back_home')}
      </Link>
    </div>
  );
};

export default NotFound;