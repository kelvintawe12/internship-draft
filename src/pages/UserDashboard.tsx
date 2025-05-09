import React, { useState } from 'react';
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

const UserDashboardPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

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
      {renderSection()}
    </UserDashboardLayout>
  );
};

export default UserDashboardPage;
