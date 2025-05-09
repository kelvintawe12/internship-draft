import React, { useState, useContext, Suspense, lazy, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useQuery, useMutation } from '@tanstack/react-query';
import { AuthContext } from '../../context/AuthContext';
import { RootState } from '../../store';
import { setOrders } from '../../store/orderSlice';
import { setNotifications } from '../../store/notificationSlice';
import { setInvoices } from '../../store/billingSlice';
import { setActivities } from '../../store/activitySlice';
import { setTickets } from '../../store/supportSlice';
import { setMessages } from '../../store/messageSlice';
import { setPreferences } from '../../store/dashboardSlice';
import { useNavigate } from 'react-router-dom';
import { Droppable, Draggable, DragDropContext, DropResult } from 'react-beautiful-dnd';
import {
  LogOut, User, Bell, CreditCard, Activity, MessageSquare, Shield, Mail,
  Search, Sun, Moon, Plus, ChevronDown, ChevronRight
} from 'lucide-react';
import ErrorBoundary from '../ErrorBoundary';

// Lazy-loaded components
const Profile = lazy(() => import('./Profile'));
const UserNotifications = lazy(() => import('./Notifications'));
const UserBilling = lazy(() => import('./UserBilling'));
const UserActivity = lazy(() => import('./UserActivity'));
const UserSupport = lazy(() => import('./UserSupport'));
const UserSecurity = lazy(() => import('./UserSecurity'));
const UserMessages = lazy(() => import('./UserMessages'));

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'shipped' | 'delivered';
  items: OrderItem[];
}

interface Notification {
  id: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'warning' | 'error';
  priority: 'low' | 'medium' | 'high';
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
  type: 'login' | 'update' | 'comment';
}

interface Ticket {
  id: string;
  subject: string;
  status: 'open' | 'pending' | 'closed';
  date: string;
  description?: string;
}

interface Message {
  id: string;
  from: string;
  subject: string;
  date: string;
  content: string;
  recipientType: 'admin' | 'support' | 'user';
}

interface SearchResult {
  type: 'order' | 'notification' | 'invoice' | 'activity' | 'ticket' | 'message';
  id: string;
  title: string;
  description: string;
}

interface Preferences {
  theme: 'light' | 'dark';
  widgetOrder: string[];
}

const fetchDashboardData = async () => {
  const [ordersResponse, notificationsResponse, invoicesResponse, activitiesResponse, ticketsResponse, messagesResponse, preferencesResponse] = await Promise.all([
    fetch('/api/orders'),
    fetch('/api/notifications'),
    fetch('/api/user/billing?page=1'),
    fetch('/api/user/activity?page=1'),
    fetch('/api/user/support/tickets?page=1'),
    fetch('/api/user/messages?page=1'),
    fetch('/api/user/preferences'),
  ]);
  if (!ordersResponse.ok || !notificationsResponse.ok || !invoicesResponse.ok || !activitiesResponse.ok || !ticketsResponse.ok || !messagesResponse.ok || !preferencesResponse.ok) {
    throw new Error('Failed to fetch dashboard data');
  }
  return Promise.all([
    ordersResponse.json(),
    notificationsResponse.json(),
    invoicesResponse.json(),
    activitiesResponse.json(),
    ticketsResponse.json(),
    messagesResponse.json(),
    preferencesResponse.json(),
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

const UserDashboard: React.FC = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const orders = useSelector((state: RootState) => state.order.orders) as Order[];
  const notifications = useSelector((state: RootState) => state.notification.notifications) as Notification[];
  const invoices = useSelector((state: RootState) => state.billing.invoices) as Invoice[];
  const activities = useSelector((state: RootState) => state.activity.activities) as Activity[];
  const tickets = useSelector((state: RootState) => state.support.tickets) as Ticket[];
  const messages = useSelector((state: RootState) => state.message.messages) as Message[];
  const preferences = useSelector((state: RootState) => state.dashboard.preferences) as Preferences;
  const [activeSection, setActiveSection] = useState<
    'profile' | 'notifications' | 'billing' | 'activity' | 'support' | 'security' | 'messages'
  >('profile');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [widgetOrder, setWidgetOrder] = useState<string[]>(preferences.widgetOrder || [
    'orders', 'notifications', 'invoices', 'activities', 'tickets', 'messages'
  ]);

  const { data, isLoading, error } = useQuery<[Order[], Notification[], Invoice[], Activity[], Ticket[], Message[], Preferences]>({
    queryKey: ['dashboardData'],
    queryFn: fetchDashboardData,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  useEffect(() => {
    if (data) {
      const [ordersData, notificationsData, invoicesData, activitiesData, ticketsData, messagesData, preferencesData] = data;
      dispatch(setOrders(ordersData));
      dispatch(setNotifications(notificationsData));
      dispatch(setInvoices(invoicesData));
      dispatch(setActivities(activitiesData));
      dispatch(setTickets(ticketsData));
      dispatch(setMessages(messagesData));
      dispatch(setPreferences(preferencesData));
    }
  }, [data, dispatch]);

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

  if (error) {
    toast.error('Failed to fetch dashboard data.', { theme: preferences.theme });
  }

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

  const navItems = [
    { id: 'profile', label: 'Profile', icon: User, component: Profile },
    { id: 'notifications', label: 'Notifications', icon: Bell, component: UserNotifications },
    { id: 'billing', label: 'Billing', icon: CreditCard, component: UserBilling },
    { id: 'activity', label: 'Activity', icon: Activity, component: UserActivity },
    { id: 'support', label: 'Support', icon: MessageSquare, component: UserSupport },
    { id: 'security', label: 'Security', icon: Shield, component: UserSecurity },
    { id: 'messages', label: 'Messages', icon: Mail, component: UserMessages },
  ];

  const quickActions = [
    { label: 'New Message', action: () => navigate('/dashboard/messages'), icon: Mail },
    { label: 'New Support Ticket', action: () => navigate('/dashboard/support'), icon: MessageSquare },
    { label: 'View Profile', action: () => navigate('/dashboard/profile'), icon: User },
  ];

  const RecentOrders = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white shadow-lg rounded-xl p-6"
    >
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Recent Orders</h3>
      {isLoading ? (
        <p className="text-sm text-gray-600 dark:text-gray-400">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-sm text-gray-600 dark:text-gray-400">No orders found.</p>
      ) : (
        <ul className="space-y-3">
          {orders.slice(0, 3).map((order) => (
            <motion.li
              key={order.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border dark:border-gray-600"
            >
              <p className="text-sm text-gray-800 dark:text-gray-100 font-semibold">Order #{order.id}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(order.date).toLocaleDateString()} •{' '}
                {new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF' }).format(order.total)} •{' '}
                <span
                  className={`font-medium ${
                    order.status === 'delivered'
                      ? 'text-green-600 dark:text-green-400'
                      : order.status === 'shipped'
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-yellow-600 dark:text-yellow-400'
                  }`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </p>
            </motion.li>
          ))}
        </ul>
      )}
    </motion.div>
  );

  const RecentNotifications = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white shadow-lg rounded-xl p-6"
    >
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Recent Notifications</h3>
      {isLoading ? (
        <p className="text-sm text-gray-600 dark:text-gray-400">Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p className="text-sm text-gray-600 dark:text-gray-400">No notifications found.</p>
      ) : (
        <ul className="space-y-3">
          {notifications.slice(0, 3).map((notification) => (
            <motion.li
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border dark:border-gray-600"
            >
              <p className="text-sm text-gray-800 dark:text-gray-100">{notification.message}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(notification.date).toLocaleString()}</p>
            </motion.li>
          ))}
        </ul>
      )}
    </motion.div>
  );

  const RecentInvoices = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white shadow-lg rounded-xl p-6"
    >
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Recent Invoices</h3>
      {isLoading ? (
        <p className="text-sm text-gray-600 dark:text-gray-400">Loading invoices...</p>
      ) : invoices.length === 0 ? (
        <p className="text-sm text-gray-600 dark:text-gray-400">No invoices found.</p>
      ) : (
        <ul className="space-y-3">
          {invoices.slice(0, 3).map((invoice) => (
            <motion.li
              key={invoice.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border dark:border-gray-600"
            >
              <p className="text-sm text-gray-800 dark:text-gray-100 font-semibold">Invoice #{invoice.id}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(invoice.date).toLocaleDateString()} •{' '}
                {new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF' }).format(invoice.amount)} •{' '}
                <span
                  className={`font-medium ${
                    invoice.status === 'paid'
                      ? 'text-green-600 dark:text-green-400'
                      : invoice.status === 'pending'
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </span>
              </p>
            </motion.li>
          ))}
        </ul>
      )}
    </motion.div>
  );

  const RecentActivities = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white shadow-lg rounded-xl p-6"
    >
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Recent Activities</h3>
      {isLoading ? (
        <p className="text-sm text-gray-600 dark:text-gray-400">Loading activities...</p>
      ) : activities.length === 0 ? (
        <p className="text-sm text-gray-600 dark:text-gray-400">No activities found.</p>
      ) : (
        <ul className="space-y-3">
          {activities.slice(0, 3).map((activity) => (
            <motion.li
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border dark:border-gray-600"
            >
              <p className="text-sm text-gray-800 dark:text-gray-100">{activity.description}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(activity.date).toLocaleString()}</p>
            </motion.li>
          ))}
        </ul>
      )}
    </motion.div>
  );

  const RecentTickets = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white shadow-lg rounded-xl p-6"
    >
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Recent Support Tickets</h3>
      {isLoading ? (
        <p className="text-sm text-gray-600 dark:text-gray-400">Loading tickets...</p>
      ) : tickets.length === 0 ? (
        <p className="text-sm text-gray-600 dark:text-gray-400">No tickets found.</p>
      ) : (
        <ul className="space-y-3">
          {tickets.slice(0, 3).map((ticket) => (
            <motion.li
              key={ticket.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border dark:border-gray-600"
            >
              <p className="text-sm text-gray-800 dark:text-gray-100 font-semibold">Ticket #{ticket.id}: {ticket.subject}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(ticket.date).toLocaleDateString()} •{' '}
                <span
                  className={`font-medium ${
                    ticket.status === 'open'
                      ? 'text-blue-600 dark:text-blue-400'
                      : ticket.status === 'pending'
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-green-600 dark:text-green-400'
                  }`}
                >
                  {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                </span>
              </p>
            </motion.li>
          ))}
        </ul>
      )}
    </motion.div>
  );

  const RecentMessages = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white shadow-lg rounded-xl p-6"
    >
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Recent Messages</h3>
      {isLoading ? (
        <p className="text-sm text-gray-600 dark:text-gray-400">Loading messages...</p>
      ) : messages.length === 0 ? (
        <p className="text-sm text-gray-600 dark:text-gray-400">No messages found.</p>
      ) : (
        <ul className="space-y-3">
          {messages.slice(0, 3).map((message) => (
            <motion.li
              key={message.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border dark:border-gray-600"
            >
              <p className="text-sm text-gray-800 dark:text-gray-100 font-semibold">From: {message.from}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Subject: {message.subject}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(message.date).toLocaleString()}</p>
            </motion.li>
          ))}
        </ul>
      )}
    </motion.div>
  );

  const widgets = {
    orders: { id: 'orders', component: RecentOrders },
    notifications: { id: 'notifications', component: RecentNotifications },
    invoices: { id: 'invoices', component: RecentInvoices },
    activities: { id: 'activities', component: RecentActivities },
    tickets: { id: 'tickets', component: RecentTickets },
    messages: { id: 'messages', component: RecentMessages },
  };

  return (
    <div className={`min-h-screen ${preferences.theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      {isAuthenticated ? (
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4"
          >
            <div className="flex items-center space-x-4">
              <img
                src={user?.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'}
                alt="User avatar"
                className="w-10 h-10 rounded-full"
              />
              <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                {user ? `Welcome, ${user.name}` : 'Dashboard'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search dashboard..."
                  className="pl-10 pr-4 py-2 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-blue-500 focus:border-blue-500 dark:text-gray-100"
                  aria-label="Search dashboard"
                />
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-500 dark:text-gray-400" />
                <AnimatePresence>
                  {searchQuery && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 z-10"
                    >
                      {isSearching ? (
                        <p className="text-sm text-gray-600 dark:text-gray-400">Searching...</p>
                      ) : !searchResults || searchResults.length === 0 ? (
                        <p className="text-sm text-gray-600 dark:text-gray-400">No results found.</p>
                      ) : (
                        <ul className="space-y-2">
                          {searchResults.slice(0, 5).map((result: SearchResult) => (
                            <li
                              key={`${result.type}-${result.id}`}
                              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer"
                              onClick={() => navigate(`/dashboard/${result.type}`)}
                            >
                              <p className="text-sm text-gray-800 dark:text-gray-100 font-semibold">{result.title}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{result.description}</p>
                            </li>
                          ))}
                        </ul>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <button
                onClick={handleThemeToggle}
                className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600"
                aria-label={`Switch to ${preferences.theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {preferences.theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
            </div>
          </motion.header>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 transition-all duration-300 ${
                isSidebarCollapsed ? 'w-16' : 'w-full lg:w-64'
              }`}
            >
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="mb-4 text-gray-800 dark:text-gray-100"
                aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {!isSidebarCollapsed && (
                <>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Navigation</h2>
                  <nav className="space-y-2">
                    {navItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id as any)}
                        className={`w-full flex items-center px-4 py-2 text-sm rounded-md ${
                          activeSection === item.id
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        aria-label={`View ${item.label}`}
                      >
                        <item.icon className="w-5 h-5 mr-2" />
                        {item.label}
                      </button>
                    ))}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-md"
                      aria-label="Log Out"
                    >
                      <LogOut className="w-5 h-5 mr-2" />
                      Log Out
                    </button>
                  </nav>
                </>
              )}
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1">
              <Suspense fallback={<p className="text-sm text-gray-600 dark:text-gray-400">Loading...</p>}>
                <ErrorBoundary>
                  {activeSection === 'profile' && <Profile />}
                  {activeSection === 'notifications' && <UserNotifications />}
                  {activeSection === 'billing' && <UserBilling />}
                  {activeSection === 'activity' && <UserActivity />}
                  {activeSection === 'support' && <UserSupport />}
                  {activeSection === 'security' && <UserSecurity />}
                  {activeSection === 'messages' && <UserMessages />}
                  {activeSection === 'profile' && (
                    <DragDropContext onDragEnd={handleDragEnd}>
                      <Droppable droppableId="widgets">
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
                  )}
                </ErrorBoundary>
              </Suspense>
            </main>
          </div>

          {/* Quick Actions FAB */}
          <motion.div
            className="fixed bottom-6 right-6"
            animate={{ scale: isQuickActionsOpen ? 1.1 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={() => setIsQuickActionsOpen(!isQuickActionsOpen)}
              className="p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  {quickActions.map((action) => (
                    <button
                      key={action.label}
                      onClick={action.action}
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
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">Please sign in to view your dashboard.</p>
          <button
            onClick={() => navigate('/signin')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            aria-label="Sign In"
          >
            Sign In
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default UserDashboard;