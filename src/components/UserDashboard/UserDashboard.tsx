import React, { useState, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '../../context/AuthContext';
import { RootState } from '../../store';
import { setOrders } from '../../store/orderSlice';
import { setNotifications } from '../../store/notificationSlice';
import { setInvoices } from '../../store/billingSlice';
import { setActivities } from '../../store/activitySlice';
import { setTickets } from '../../store/supportSlice';
import { setMessages } from '../../store/messageSlice';
import Profile from './Profile';
import UserNotifications from './Notifications';
import UserBilling from './UserBilling';
import UserActivity from './UserActivity';
import UserSupport from './UserSupport';
import UserSecurity from './UserSecurity';
import UserMessages from './UserMessages';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Bell, CreditCard, Activity, MessageSquare, Shield, Mail } from 'lucide-react';

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

const fetchDashboardData = async (): Promise<[Order[], Notification[], Invoice[], Activity[], Ticket[], Message[]]> => {
  const [ordersResponse, notificationsResponse, invoicesResponse, activitiesResponse, ticketsResponse, messagesResponse] = await Promise.all([
    fetch('/api/orders'),
    fetch('/api/notifications'),
    fetch('/api/user/billing?page=1'),
    fetch('/api/user/activity?page=1'),
    fetch('/api/user/support/tickets?page=1'),
    fetch('/api/user/messages?page=1'),
  ]);
  if (!ordersResponse.ok || !notificationsResponse.ok || !invoicesResponse.ok || !activitiesResponse.ok || !ticketsResponse.ok || !messagesResponse.ok) {
    throw new Error('Failed to fetch dashboard data');
  }
  return Promise.all([
    ordersResponse.json(),
    notificationsResponse.json(),
    invoicesResponse.json(),
    activitiesResponse.json(),
    ticketsResponse.json(),
    messagesResponse.json(),
  ]);
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
  const [activeSection, setActiveSection] = useState<
    'profile' | 'notifications' | 'billing' | 'activity' | 'support' | 'security' | 'messages'
  >('profile');

  const { isLoading, error, data } = useQuery<[Order[], Notification[], Invoice[], Activity[], Ticket[], Message[]]>({
    queryKey: ['dashboardData'],
    queryFn: fetchDashboardData,
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (data) {
      const [ordersData, notificationsData, invoicesData, activitiesData, ticketsData, messagesData] = data;
      dispatch(setOrders(ordersData));
      dispatch(setNotifications(notificationsData));
      dispatch(setInvoices(invoicesData));
      dispatch(setActivities(activitiesData));
      dispatch(setTickets(ticketsData));
      dispatch(setMessages(messagesData));
    }
  }, [data, dispatch]);

  if (error) {
    toast.error('Failed to fetch dashboard data.', { theme: 'light' });
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/signin');
    } catch (error) {
      toast.error('Failed to log out.', { theme: 'light' });
    }
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

  const RecentOrders = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white shadow-lg rounded-xl p-6 mb-6"
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h3>
      {isLoading ? (
        <p className="text-sm text-gray-600">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-sm text-gray-600">No orders found.</p>
      ) : (
        <ul className="space-y-3">
          {orders.slice(0, 3).map((order) => (
            <motion.li
              key={order.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 bg-gray-50 rounded-lg border"
            >
              <p className="text-sm text-gray-800 font-semibold">Order #{order.id}</p>
              <p className="text-xs text-gray-500">
                {new Date(order.date).toLocaleDateString()} •{' '}
                {new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF' }).format(order.total)} •{' '}
                <span
                  className={`font-medium ${
                    order.status === 'delivered'
                      ? 'text-green-600'
                      : order.status === 'shipped'
                      ? 'text-blue-600'
                      : 'text-yellow-600'
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
      className="bg-white shadow-lg rounded-xl p-6 mb-6"
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Notifications</h3>
      {isLoading ? (
        <p className="text-sm text-gray-600">Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p className="text-sm text-gray-600">No notifications found.</p>
      ) : (
        <ul className="space-y-3">
          {notifications.slice(0, 3).map((notification) => (
            <motion.li
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 bg-gray-50 rounded-lg border"
            >
              <p className="text-sm text-gray-800">{notification.message}</p>
              <p className="text-xs text-gray-500">{new Date(notification.date).toLocaleString()}</p>
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
      className="bg-white shadow-lg rounded-xl p-6 mb-6"
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Invoices</h3>
      {isLoading ? (
        <p className="text-sm text-gray-600">Loading invoices...</p>
      ) : invoices.length === 0 ? (
        <p className="text-sm text-gray-600">No invoices found.</p>
      ) : (
        <ul className="space-y-3">
          {invoices.slice(0, 3).map((invoice) => (
            <motion.li
              key={invoice.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 bg-gray-50 rounded-lg border"
            >
              <p className="text-sm text-gray-800 font-semibold">Invoice #{invoice.id}</p>
              <p className="text-xs text-gray-500">
                {new Date(invoice.date).toLocaleDateString()} •{' '}
                {new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF' }).format(invoice.amount)} •{' '}
                <span
                  className={`font-medium ${
                    invoice.status === 'paid'
                      ? 'text-green-600'
                      : invoice.status === 'pending'
                      ? 'text-yellow-600'
                      : 'text-red-600'
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
      className="bg-white shadow-lg rounded-xl p-6 mb-6"
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activities</h3>
      {isLoading ? (
        <p className="text-sm text-gray-600">Loading activities...</p>
      ) : activities.length === 0 ? (
        <p className="text-sm text-gray-600">No activities found.</p>
      ) : (
        <ul className="space-y-3">
          {activities.slice(0, 3).map((activity) => (
            <motion.li
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 bg-gray-50 rounded-lg border"
            >
              <p className="text-sm text-gray-800">{activity.description}</p>
              <p className="text-xs text-gray-500">{new Date(activity.date).toLocaleString()}</p>
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
      className="bg-white shadow-lg rounded-xl p-6 mb-6"
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Support Tickets</h3>
      {isLoading ? (
        <p className="text-sm text-gray-600">Loading tickets...</p>
      ) : tickets.length === 0 ? (
        <p className="text-sm text-gray-600">No tickets found.</p>
      ) : (
        <ul className="space-y-3">
          {tickets.slice(0, 3).map((ticket) => (
            <motion.li
              key={ticket.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 bg-gray-50 rounded-lg border"
            >
              <p className="text-sm text-gray-800 font-semibold">Ticket #{ticket.id}: {ticket.subject}</p>
              <p className="text-xs text-gray-500">
                {new Date(ticket.date).toLocaleDateString()} •{' '}
                <span
                  className={`font-medium ${
                    ticket.status === 'open'
                      ? 'text-blue-600'
                      : ticket.status === 'pending'
                      ? 'text-yellow-600'
                      : 'text-green-600'
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
      className="bg-white shadow-lg rounded-xl p-6 mb-6"
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Messages</h3>
      {isLoading ? (
        <p className="text-sm text-gray-600">Loading messages...</p>
      ) : messages.length === 0 ? (
        <p className="text-sm text-gray-600">No messages found.</p>
      ) : (
        <ul className="space-y-3">
          {messages.slice(0, 3).map((message) => (
            <motion.li
              key={message.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 bg-gray-50 rounded-lg border"
            >
              <p className="text-sm text-gray-800 font-semibold">From: {message.from}</p>
              <p className="text-sm text-gray-600">Subject: {message.subject}</p>
              <p className="text-xs text-gray-500">{new Date(message.date).toLocaleString()}</p>
            </motion.li>
          ))}
        </ul>
      )}
    </motion.div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {isAuthenticated ? (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-64 bg-white shadow-lg rounded-xl p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {user ? `Welcome, ${user.name}` : 'Dashboard'}
            </h2>
            <nav className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as any)}
                  className={`w-full flex items-center px-4 py-2 text-sm rounded-md ${
                    activeSection === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  aria-label={`View ${item.label}`}
                >
                  <item.icon className="w-5 h-5 mr-2" />
                  {item.label}
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                aria-label="Log Out"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Log Out
              </button>
            </nav>
          </motion.aside>

          {/* Main Content */}
          <main className="flex-1">
            {activeSection === 'profile' && <Profile />}
            {activeSection === 'notifications' && <UserNotifications />}
            {activeSection === 'billing' && <UserBilling />}
            {activeSection === 'activity' && <UserActivity />}
            {activeSection === 'support' && <UserSupport />}
            {activeSection === 'security' && <UserSecurity />}
            {activeSection === 'messages' && <UserMessages />}
            {activeSection === 'profile' && (
              <>
                <RecentOrders />
                <RecentNotifications />
                <RecentInvoices />
                <RecentActivities />
                <RecentTickets />
                <RecentMessages />
              </>
            )}
          </main>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <p className="text-sm text-gray-600">Please sign in to view your dashboard.</p>
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