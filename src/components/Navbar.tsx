import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Spinner from './Spinner';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, isAdmin, user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout(); // Calls AuthContext logout (handles API and toast)
      navigate('/signin');
    } catch (error) {
      // Error already toasted in AuthContext
    }
  };

  return (
    <nav className="bg-indigo-600 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold" aria-label="Home">
              Mount Meru SoyCo
            </Link>
            {isAuthenticated && user && (
              <span className="ml-4 text-sm hidden md:block">
                Welcome, {user.name}
              </span>
            )}
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
                {isAdmin && (
                  <Link to="/dashboard" className="hover:bg-indigo-700 px-3 py-2 rounded" aria-label="Dashboard">
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="hover:bg-indigo-700 px-3 py-2 rounded flex items-center"
                  disabled={loading}
                  aria-label="Logout"
                >
                  {loading ? <Spinner loading={true} variant="inline" /> : 'Logout'}
                </button>
              </>
            ) : (
              <Link to="/signin" className="hover:bg-indigo-700 px-3 py-2 rounded" aria-label="Sign In">
                Sign In
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
            {isAuthenticated && user && (
              <span className="block px-3 py-2 text-sm text-gray-200">
                Welcome, {user.name}
              </span>
            )}
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
                {isAdmin && (
                  <Link
                    to="/dashboard"
                    className="block hover:bg-indigo-700 px-3 py-2 rounded"
                    onClick={() => setIsOpen(false)}
                    aria-label="Dashboard"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block hover:bg-indigo-700 px-3 py-2 rounded w-full text-left"
                  disabled={loading}
                  aria-label="Logout"
                >
                  {loading ? <Spinner loading={true} variant="inline" /> : 'Logout'}
                </button>
              </>
            ) : (
              <Link
                to="/signin"
                className="block hover:bg-indigo-700 px-3 py-2 rounded"
                onClick={() => setIsOpen(false)}
                aria-label="Sign In"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;