import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MainLayout from './components/MainLayout';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import ForgotPassword from './pages/ForgotPassword';
import Products from './pages/Products';
import About from './pages/About';
import Contact from './pages/Contact';
import Order from './pages/Order';
import { dashboardRoutes } from './routes/dashboardRoutes';
import { AuthContext, AuthProvider } from './context/AuthContext';
import NotFound from './pages/NotFound';
import ImportedProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  const { i18n } = useTranslation();

  return (
    <AuthProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/products" element={<Products />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/order" element={<Order />} />
            <Route
              path="/dashboard/*"
              element={
                <ImportedProtectedRoute>
                  {dashboardRoutes()}
                </ImportedProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={i18n.language === 'rw'}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </MainLayout>
      </Router>
    </AuthProvider>
  );
};

// ProtectedRoute Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? <>{children}</> : <Navigate to="/signin" replace />;
};

export default App;