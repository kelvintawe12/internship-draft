import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BellIcon, UserCircle2, SearchIcon } from 'lucide-react';
import {
  FaTachometerAlt,
  FaUser,
  FaCog,
  FaBell,
  FaChartLine,
  FaEnvelope,
  FaLock,
  FaCreditCard,
  FaQuestionCircle,
  FaBars,
  FaTimes,
} from 'react-icons/fa';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection, isSidebarOpen, setIsSidebarOpen }) => {
  const sections = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaTachometerAlt className="w-4 h-4" /> },
    { id: 'profile', label: 'Profile', icon: <FaUser className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <FaCog className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <FaBell className="w-4 h-4" /> },
    { id: 'activity', label: 'Activity', icon: <FaChartLine className="w-4 h-4" /> },
    { id: 'messages', label: 'Messages', icon: <FaEnvelope className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <FaLock className="w-4 h-4" /> },
    { id: 'billing', label: 'Billing', icon: <FaCreditCard className="w-4 h-4" /> },
    { id: 'support', label: 'Support', icon: <FaQuestionCircle className="w-4 h-4" /> },
  ];

  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <aside
      className={`bg-white shadow-md h-screen p-4 fixed w-56 z-30 transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Acme Dashboard</h2>
        <button
          className="text-gray-600 hover:text-gray-800 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          <FaTimes className="w-5 h-5" />
        </button>
      </div>
      <nav>
        <ul>
          {sections.map((section) => (
            <li key={section.id} className="mb-1">
              <button
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center space-x-2 text-sm ${
                  activeSection === section.id
                    ? 'bg-indigo-500 text-white font-medium'
                    : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
                }`}
                onClick={() => handleNavClick(section.id)}
                aria-current={activeSection === section.id ? 'page' : undefined}
              >
                {section.icon}
                <span>{section.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

interface HeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 flex items-center justify-between px-4 py-2 z-20 shadow-sm">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          className="text-gray-600 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 md:hidden"
        >
          {isSidebarOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
        </button>
        <h1 className="text-base font-semibold text-gray-800 hidden md:block">User Dashboard</h1>
        <div className="relative hidden sm:block">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="pl-8 pr-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Search dashboard"
          />
          <SearchIcon className="w-4 h-4 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <button
          aria-label="Notifications"
          className="relative text-gray-600 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <BellIcon className="w-5 h-5" />
          <span className="absolute top-0 right-0 inline-block w-1.5 h-1.5 bg-red-600 rounded-full"></span>
        </button>
        <div className="relative">
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            aria-label="User menu"
            className="flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <span className="text-xs font-medium text-gray-700 hidden sm:inline">John Doe</span>
            <UserCircle2 className="w-6 h-6 text-gray-600" />
          </button>
          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50">
              <Link
                to="/profile"
                className="block px-3 py-1.5 text-xs text-gray-700 hover:bg-indigo-50"
                onClick={() => setProfileMenuOpen(false)}
              >
                Profile
              </Link>
              <Link
                to="/settings"
                className="block px-3 py-1.5 text-xs text-gray-700 hover:bg-indigo-50"
                onClick={() => setProfileMenuOpen(false)}
              >
                Settings
              </Link>
              <Link
                to="/logout"
                className="block px-3 py-1.5 text-xs text-gray-700 hover:bg-indigo-50"
                onClick={() => setProfileMenuOpen(false)}
              >
                Logout
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

interface UserDashboardLayoutProps {
  children: React.ReactNode;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const UserDashboardLayout: React.FC<UserDashboardLayoutProps> = ({ children, activeSection, setActiveSection }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="flex flex-col flex-1">
        <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <main className="flex-1 pt-12 md:pl-56">
          <div className="h-full max-w-6xl mx-auto px-4 sm:px-6">
            {activeSection === 'dashboard' ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 h-full">
                {/* Stats Cards */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: 'Total Users', value: '1,234', change: '+5%' },
                    { title: 'Revenue', value: '$12,345', change: '+12%' },
                    { title: 'Active Sessions', value: '456', change: '-3%' },
                    { title: 'New Tickets', value: '78', change: '+8%' },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                    >
                      <h3 className="text-xs font-medium text-gray-500">{stat.title}</h3>
                      <p className="text-lg font-semibold text-gray-800 mt-1">{stat.value}</p>
                      <p className="text-xs text-green-600 mt-1">{stat.change}</p>
                    </div>
                  ))}
                </div>
                {/* Chart Placeholder */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 lg:row-span-2">
                  <h3 className="text-sm font-semibold text-gray-800 mb-2">Performance Overview</h3>
                  <div className="h-48 sm:h-64 bg-gray-100 rounded-md flex items-center justify-center">
                    <p className="text-xs text-gray-500">Chart Placeholder</p>
                  </div>
                </div>
                {/* Recent Activity */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 lg:col-span-2">
                  <h3 className="text-sm font-semibold text-gray-800 mb-2">Recent Activity</h3>
                  <ul className="space-y-2">
                    {[
                      { user: 'Jane Smith', action: 'Updated profile', time: '2h ago' },
                      { user: 'Mike Johnson', action: 'Created ticket', time: '4h ago' },
                      { user: 'Sarah Lee', action: 'Processed payment', time: '1d ago' },
                    ].map((activity, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center">
                          <FaUser className="h-3 w-3 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-800">
                            {activity.user} {activity.action}
                          </p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 h-full">
                {children}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboardLayout;