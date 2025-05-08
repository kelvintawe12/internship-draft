import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Spinner from './Spinner';

const Footer: React.FC = () => {
  return (
    <footer className="py-4 px-6 border-t border-gray-300 text-sm bg-gray-50 text-gray-700">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <p>© 2025 Mount Meru SoyCo Rwanda</p>
        <p className="hidden md:block">v1.0.0</p>
      </div>
    </footer>
  );
};

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // simulate loading delay for page navigation
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <Navbar />
      {loading && <Spinner loading={true} variant="fullscreen" />}
      <main className="flex-grow max-w-7xl mx-auto w-full p-4 md:p-6">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
