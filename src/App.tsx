import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import MainLayout from './layout/MainLayout';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Products from './pages/Products';
import About from './pages/About';
import Contact from './pages/Contact';
import Order from './pages/Order';
import Terms from './pages/Terms';
import ForgotPassword from './pages/ForgotPassword';
import NotFound from './pages/NotFound';
import SignUp from './components/Auth/SignUp';
import SignIn from './components/Auth/SignIn';
import VerifyEmail from './components/Auth/VerifyEmail';
import ProtectedRoute from './components/ProtectedRoute';
import UserDashboardPage from './pages/UserDashboard';
import DashboardRoutes from './routes/dashboardRoutes';
import ErrorBoundary from './pages/UserDashboardLayout';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<MainLayout><Home /></MainLayout>} />
            <Route path="/products" element={<MainLayout><Products /></MainLayout>} />
            <Route path="/about" element={<MainLayout><About /></MainLayout>} />
            <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
            <Route path="/order" element={<MainLayout><Order /></MainLayout>} />
            <Route path="/terms" element={<MainLayout><Terms /></MainLayout>} />
            <Route path="/forgot-password" element={<MainLayout><ForgotPassword /></MainLayout>} />
            <Route path="/signup" element={<MainLayout><SignUp /></MainLayout>} />
            <Route path="/signin" element={<MainLayout><SignIn /></MainLayout>} />
            <Route path="/verify-email/:token" element={<MainLayout><VerifyEmail /></MainLayout>} />
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute>
                  <DashboardRoutes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <UserDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </AuthProvider>
    </Provider>
  );
};

export default App;