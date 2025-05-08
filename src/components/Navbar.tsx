import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Spinner from './Spinner';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('adminToken'); // Mocked auth check

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem('adminToken');
      setIsLoggingOut(false);
      navigate('/admin/login');
    }, 1000);
  };

  return (
    <nav className="bg-indigo-600 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold" aria-label="Home">
              Mount Meru SoyCo
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="hover:bg-indigo-700 px-3 py-2 rounded" aria-label="Home">
              Home
            </Link>
            <Link to="/products" className="hover:bg-indigo-700 px-3 py-2 rounded" aria-label="Products">
              Products
            </Link>
            <Link to="/about" className="hover:bg-indigo-700 px-3 py-2 rounded" aria-label="About">
              About
            </Link>
            <Link to="/contact" className="hover:bg-indigo-700 px-3 py-2 rounded" aria-label="Contact">
              Contact
            </Link>
            <Link to="/order" className="hover:bg-indigo-700 px-3 py-2 rounded" aria-label="Order">
              Order
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/admin" className="hover:bg-indigo-700 px-3 py-2 rounded" aria-label="Admin">
                  Admin
                </Link>
                <button
                  onClick={handleLogout}
                  className="hover:bg-indigo-700 px-3 py-2 rounded flex items-center"
                  disabled={isLoggingOut}
                  aria-label="Logout"
                >
                  {isLoggingOut ? <Spinner /> : 'Logout'}
                </button>
              </>
            ) : (
              <Link to="/admin/login" className="hover:bg-indigo-700 px-3 py-2 rounded" aria-label="Admin">
                Admin
              </Link>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block hover:bg-indigo-700 px-3 py-2 rounded"
              onClick={() => setIsOpen(false)}
              aria-label="Home"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="block hover:bg-indigo-700 px-3 py-2 rounded"
              onClick={() => setIsOpen(false)}
              aria-label="Products"
            >
              Products
            </Link>
            <Link
              to="/about"
              className="block hover:bg-indigo-700 px-3 py-2 rounded"
              onClick={() => setIsOpen(false)}
              aria-label="About"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block hover:bg-indigo-700 px-3 py-2 rounded"
              onClick={() => setIsOpen(false)}
              aria-label="Contact"
            >
              Contact
            </Link>
            <Link
              to="/order"
              className="block hover:bg-indigo-700 px-3 py-2 rounded"
              onClick={() => setIsOpen(false)}
              aria-label="Order"
            >
              Order
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/admin"
                  className="block hover:bg-indigo-700 px-3 py-2 rounded"
                  onClick={() => setIsOpen(false)}
                  aria-label="Admin"
                >
                  Admin
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block hover:bg-indigo-700 px-3 py-2 rounded w-full text-left"
                  disabled={isLoggingOut}
                  aria-label="Logout"
                >
                  {isLoggingOut ? <Spinner /> : 'Logout'}
                </button>
              </>
            ) : (
              <Link
                to="/admin/login"
                className="block hover:bg-indigo-700 px-3 py-2 rounded"
                onClick={() => setIsOpen(false)}
                aria-label="Admin"
              >
                Admin
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;