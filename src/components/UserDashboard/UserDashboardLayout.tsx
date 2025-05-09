import React, { useState, useContext, Suspense, lazy } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import {
  Menu, X, User, Bell, CreditCard, MessageSquare, Lock, HelpCircle, Search, Sun, Moon, Plus,
  ChevronDown, ChevronRight, LogOut, UserCircle
} from 'lucide-react';
import { Activity as ActivityIcon } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { RootState } from '../../store';
import { setPreferences } from '../../store/dashboardSlice';
import ErrorBoundary from '../ErrorBoundary';

// Lazy-loaded components
const Profile = lazy(() => import('./Profile'));
const Notifications = lazy(() => import('./Notifications'));
const Billing = lazy(() => import('./UserBilling'));
const Activity = lazy(() => import('./UserActivity'));
const Support = lazy(() => import('./UserSupport'));
const Security = lazy(() => import('./UserSecurity'));
const Messages = lazy(() => import('./UserMessages'));

interface Preferences {
  theme: 'light' | 'dark';
  widgetOrder: string[];
}

interface SearchResult {
  type: 'order' | 'notification' | 'invoice' | 'activity' | 'ticket' | 'message';
  id: string;
  title: string;
  description: string;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'shipped' | 'delivered';
}

interface Notification {
  id: string;
  message: string;
  date: string;
  read: boolean;
}

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed';
}

interface Activity {
  id: string;
  description: string;
  date: string;
}

interface ActivityData {
  id: string;
  description: string;
  date: string;
}

interface Ticket {
  id: string;
  subject: string;
  status: 'open' | 'pending' | 'closed';
  date: string;
}

interface Message {
  id: string;
  from: string;
  subject: string;
  date: string;
}

const fetchDashboardStats = async () => {
  const [ordersResponse, notificationsResponse, invoicesResponse, ticketsResponse] = await Promise.all([
    fetch('/api/orders'),
    fetch('/api/notifications?status=unread'),
    fetch('/api/user/billing?page=1'),
    fetch('/api/user/support/tickets?page=1'),
  ]);
  if (!ordersResponse.ok || !notificationsResponse.ok || !invoicesResponse.ok || !ticketsResponse.ok) {
    throw new Error('Failed to fetch dashboard stats');
  }
  return Promise.all([
    ordersResponse.json(),
    notificationsResponse.json(),
    invoicesResponse.json(),
    ticketsResponse.json(),
  ]);
};

const searchDashboard = async (query: string) => {
  const response = await fetch(`/api/dashboard/search?query=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error('Failed to search dashboard');
  return response.json();
};

const updatePreferences = async (preferences: Preferences) => {
  const response = await fetch('/api/user/preferences', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(preferences),
  });
  if (!response.ok) throw new Error('Failed to update preferences');
  return response.json();
};

const UserDashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const preferences = useSelector((state: RootState) => state.dashboard.preferences) as Preferences;
  const orders = useSelector((state: RootState) => state.order.orders) as Order[];
  const notifications = useSelector((state: RootState) => state.notification.notifications) as Notification[];
  const invoices = useSelector((state: RootState) => state.billing.invoices) as Invoice[];
  const activities = useSelector((state: RootState) => state.activity.activities) as Activity[];
  const tickets = useSelector((state: RootState) => state.support.tickets) as Ticket[];
  const messages = useSelector((state: RootState) => state.message.messages) as Message[];
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [widgetOrder, setWidgetOrder] = useState<string[]>(preferences.widgetOrder || [
    'stats', 'activity', 'performance'
  ]);

  const { data: statsData, isLoading: isStatsLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardStats,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const { data: searchResults, isFetching: isSearching } = useQuery({
    queryKey: ['dashboardSearch', searchQuery],
    queryFn: () => searchDashboard(searchQuery),
    enabled: !!searchQuery,
    staleTime: 60 * 1000, // Cache search results for 1 minute
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: updatePreferences,
    onSuccess: (data) => {
      dispatch(setPreferences(data));
      toast.success('Preferences updated successfully.', { theme: preferences.theme });
    },
    onError: () => {
      toast.error('Failed to update preferences.', { theme: preferences.theme });
    },
  });

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/signin');
      toast.success('Logged out successfully.', { theme: preferences.theme });
    } catch (error) {
      toast.error('Failed to log out.', { theme: preferences.theme });
    }
  };

  const handleThemeToggle = () => {
    const newTheme = preferences.theme === 'light' ? 'dark' : 'light';
    updatePreferencesMutation.mutate({ ...preferences, theme: newTheme });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newOrder = [...widgetOrder];
    const [reorderedItem] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, reorderedItem);
    setWidgetOrder(newOrder);
    updatePreferencesMutation.mutate({ ...preferences, widgetOrder: newOrder });
  };

  const sections = [
    { id: 'dashboard', label: 'Dashboard', icon: <span className="w-4 h-4"><Activity /></span>, component: null },
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" />, component: Profile },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" />, component: Notifications },
    { id: 'activity', label: 'Activity', icon: <ActivityIcon className="w-4 h-4" />, component: Activity },
    { id: 'messages', label: 'Messages', icon: <MessageSquare className="w-4 h-4" />, component: Messages },
    { id: 'security', label: 'Security', icon: <Lock className="w-4 h-4" />, component: Security },
    { id: 'billing', label: 'Billing', icon: <CreditCard className="w-4 h-4" />, component: Billing },
    { id: 'support', label: 'Support', icon: <HelpCircle className="w-4 h-4" />, component: Support },
  ];

  const StatsWidget = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      {[
        { title: 'Total Orders', value: isStatsLoading ? '...' : orders.length.toString(), change: '+5%' },
        { title: 'Revenue', value: isStatsLoading ? '...' : new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF' }).format(orders.reduce((sum, o) => sum + o.total, 0)), change: '+12%' },
        { title: 'Unread Notifications', value: isStatsLoading ? '...' : notifications.filter(n => !n.read).length.toString(), change: '-3%' },
        { title: 'Open Tickets', value: isStatsLoading ? '...' : tickets.filter(t => t.status === 'open').length.toString(), change: '+8%' },
      ].map((stat, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700"
        >
          <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">{stat.title}</h3>
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-100 mt-1">{stat.value}</p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">{stat.change}</p>
        </div>
      ))}
    </motion.div>
  );

  const ActivityWidget = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700 lg:col-span-2"
    >
      <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">Recent Activity</h3>
      {isStatsLoading ? (
        <p className="text-xs text-gray-500 dark:text-gray-400">Loading activities...</p>
      ) : activities.length === 0 ? (
        <p className="text-xs text-gray-500 dark:text-gray-400">No recent activities.</p>
      ) : (
        <ul className="space-y-2">
          {activities.slice(0, 3).map((activity) => (
            <li key={activity.id} className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                <User className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-800 dark:text-gray-100">{activity.description}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(activity.date).toLocaleString()}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );

  const PerformanceWidget = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700 lg:row-span-2"
    >
      <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">Performance Overview</h3>
      <div className="h-48 sm:h-64 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">Chart Placeholder (Implement with Chart.js)</p>
      </div>
    </motion.div>
  );

  const widgets = {
    stats: { id: 'stats', component: StatsWidget },
    activity: { id: 'activity', component: ActivityWidget },
    performance: { id: 'performance', component: PerformanceWidget },
  };

  return (
    <div className={`flex h-screen ${preferences.theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'} text-gray-900 dark:text-gray-100`}>
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -224 }}
        animate={{ x: isSidebarOpen ? 0 : -224 }}
        transition={{ duration: 0.3 }}
        className={`bg-white dark:bg-gray-800 shadow-md h-screen p-4 fixed w-56 z-30 md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:w-56 md:block`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Acme Dashboard</h2>
          <button
            className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
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
                      : 'text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => {
                    setActiveSection(section.id);
                    if (window.innerWidth < 768) setIsSidebarOpen(false);
                  }}
                  aria-current={activeSection === section.id ? 'page' : undefined}
                >
                  {section.icon}
                  <span>{section.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </motion.aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 md:pl-56">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 py-2 z-20 shadow-sm"
        >
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
              className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 md:hidden"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-base font-semibold text-gray-800 dark:text-gray-100 hidden md:block">User Dashboard</h1>
            <div className="relative hidden sm:block">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="pl-8 pr-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-gray-100"
                aria-label="Search dashboard"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
              <AnimatePresence>
                {searchQuery && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 z-10"
                  >
                    {isSearching ? (
                      <p className="text-xs text-gray-600 dark:text-gray-400">Searching...</p>
                    ) : !searchResults || searchResults.length === 0 ? (
                      <p className="text-xs text-gray-600 dark:text-gray-400">No results found.</p>
                    ) : (
                      <ul className="space-y-2">
                        {searchResults.slice(0, 5).map((result: SearchResult) => (
                          <li
                            key={`${result.type}-${result.id}`}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer"
                            onClick={() => {
                              setActiveSection(result.type);
                              setSearchQuery('');
                            }}
                          >
                            <p className="text-xs font-medium text-gray-800 dark:text-gray-100">{result.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{result.description}</p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              aria-label="Notifications"
              className="relative text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <Bell className="w-5 h-5" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute top-0 right-0 inline-block w-1.5 h-1.5 bg-red-600 rounded-full"></span>
              )}
            </button>
            <button
              onClick={handleThemeToggle}
              className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600"
              aria-label={`Switch to ${preferences.theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {preferences.theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                aria-label="User menu"
                className="flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">{user?.name || 'User'}</span>
                <UserCircle className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
              {profileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1 z-50"
                >
                  <Link
                    to="/dashboard/profile"
                    className="block px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      setActiveSection('profile');
                    }}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="flex-1 pt-12">
          <div className="h-full max-w-6xl mx-auto px-4 sm:px-6">
            {activeSection === 'dashboard' ? (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="widgets">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 h-full"
                    >
                      {widgetOrder.map((widgetId, index) => {
                        const Widget = widgets[widgetId as keyof typeof widgets].component;
                        return (
                          <Draggable key={widgetId} draggableId={widgetId} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <ErrorBoundary>
                                  <Widget />
                                </ErrorBoundary>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            ) : (
              <Suspense fallback={<p className="text-sm text-gray-600 dark:text-gray-400">Loading...</p>}>
                <ErrorBoundary>
                  {sections.find(s => s.id === activeSection)?.component ? (
                    React.createElement(sections.find(s => s.id === activeSection)!.component!)
                  ) : (
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700 h-full">
                      {children}
                    </div>
                  )}
                </ErrorBoundary>
              </Suspense>
            )}
          </div>
        </main>

        {/* Quick Actions FAB */}
        <motion.div
          className="fixed bottom-6 right-6"
          animate={{ scale: isQuickActionsOpen ? 1.1 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <button
            onClick={() => setIsQuickActionsOpen(!isQuickActionsOpen)}
            className="p-4 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Toggle quick actions"
          >
            <Plus className="w-6 h-6" />
          </button>
          <AnimatePresence>
            {isQuickActionsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 space-y-2"
              >
                {[
                  { label: 'New Message', action: () => setActiveSection('messages'), icon: MessageSquare },
                  { label: 'New Support Ticket', action: () => setActiveSection('support'), icon: HelpCircle },
                  { label: 'View Profile', action: () => setActiveSection('profile'), icon: User },
                ].map((action) => (
                  <button
                    key={action.label}
                    onClick={() => {
                      action.action();
                      setIsQuickActionsOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    aria-label={action.label}
                  >
                    <action.icon className="w-5 h-5 mr-2" />
                    {action.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default UserDashboardLayout;