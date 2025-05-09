import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import UserDashboardLayout from '../components/UserDashboard/UserDashboardLayout';
import UserDashboard from '../components/UserDashboard/UserDashboard';
import Settings from '../components/UserDashboard/Settings';
import Notifications from '../components/UserDashboard/Notifications';
import Profile from '../components/UserDashboard/Profile';
import UserActivity from '../components/UserDashboard/UserActivity';
import UserMessages from '../components/UserDashboard/UserMessages';
import UserSecurity from '../components/UserDashboard/UserSecurity';
import UserBilling from '../components/UserDashboard/UserBilling';
import UserSupport from '../components/UserDashboard/UserSupport';

// Simple ErrorBoundary component
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught in UserDashboardPage:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-center">
          <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">Something went wrong.</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Please refresh the page or try again later.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const UserDashboardPage: React.FC = () => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState<string>('dashboard');

  // Sync activeSection with URL
  useEffect(() => {
    const path = location.pathname.split('/').pop() || 'dashboard';
    if (['dashboard', 'settings', 'notifications', 'profile', 'activity', 'messages', 'security', 'billing', 'support'].includes(path)) {
      setActiveSection(path);
    } else {
      setActiveSection('dashboard');
    }
  }, [location.pathname]);

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <UserDashboard />;
      case 'settings':
        return <Settings />;
      case 'notifications':
        return <Notifications />;
      case 'profile':
        return <Profile />;
      case 'activity':
        return <UserActivity />;
      case 'messages':
        return <UserMessages />;
      case 'security':
        return <UserSecurity />;
      case 'billing':
        return <UserBilling />;
      case 'support':
        return <UserSupport />;
      default:
        return <UserDashboard />;
    }
  };

  return (
    <UserDashboardLayout activeSection={activeSection} setActiveSection={setActiveSection}>
      <ErrorBoundary>
        {renderSection()}
      </ErrorBoundary>
    </UserDashboardLayout>
  );
};

export default UserDashboardPage;