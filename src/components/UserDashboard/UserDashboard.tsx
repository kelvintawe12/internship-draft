import React, { useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { ChevronDownIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '../../context/AuthContext';
import { RootState } from '../../store';
import { setOrders } from '../../store/orderSlice';
import { setNotifications } from '../../store/notificationSlice';
import Profile from './Profile';
import { useNavigate } from 'react-router-dom';

interface OrderItem {
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
}

const UserDashboard: React.FC = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const orders = useSelector((state: RootState) => state.order.orders as Order[]);
  const notifications = useSelector((state: RootState) => state.notification.notifications as Notification[]);
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications'>('profile');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('date-desc');

  const { isLoading, error } = useQuery({
    queryKey: ['dashboardData'],
    queryFn: async () => {
      const [ordersResponse, notificationsResponse] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/notifications'),
      ]);
      if (!ordersResponse.ok || !notificationsResponse.ok) {
        throw new Error('Failed to fetch data');
      }
      const ordersData = await ordersResponse.json();
      const notificationsData = await notificationsResponse.json();
      dispatch(setOrders(ordersData));
      dispatch(setNotifications(notificationsData));
      return { ordersData, notificationsData };
    },
    enabled: isAuthenticated,
  });

  if (error) {
    toast.error('Failed to fetch data.', { theme: 'light' });
  }

  const filteredOrders = orders
    .filter((order) => (status === 'all' ? true : order.status === status))
    .sort((a, b) => {
      if (sort === 'date-asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sort === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sort === 'total-asc') return a.total - b.total;
      if (sort === 'total-desc') return b.total - a.total;
      return 0;
    });

  const statuses = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
  ];

  const sortOptions = [
    { value: 'date-desc', label: 'Date: Newest First' },
    { value: 'date-asc', label: 'Date: Oldest First' },
    { value: 'total-asc', label: 'Total: Low to High' },
    { value: 'total-desc', label: 'Total: High to Low' },
  ];

  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/signin');
    } catch (error) {
      // Error handled by logout
    }
  };

  const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
    return (
      <motion.div
        className="bg-white shadow-sm rounded-lg p-4 border border-gray-100"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
        role="region"
        aria-label={`Order ${order.id}`}
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-gray-800">Order #{order.id}</h3>
          <span
            className={`text-xs font-medium ${
              order.status === 'delivered'
                ? 'text-green-500'
                : order.status === 'shipped'
                ? 'text-blue-500'
                : 'text-yellow-500'
            }`}
          >
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>
        <p className="text-gray-600 text-xs mb-2">
          Placed on: {new Date(order.date).toLocaleDateString()}
        </p>
        <p className="text-gray-600 text-xs mb-2">Total: RWF {order.total.toFixed(2)}</p>
        <div className="mt-2">
          <h4 className="text-xs font-medium text-gray-700 mb-1">Items:</h4>
          <ul className="list-disc list-inside text-xs text-gray-600">
            {order.items.map((item, index) => (
              <li key={index}>
                {item.name} - {item.quantity} x RWF {item.price.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {user ? `Welcome, ${user.name}` : 'User Dashboard'}
        </h1>
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-1.5 px-4 rounded-lg text-sm hover:bg-red-600 focus:ring-2 focus:ring-red-500"
            aria-label="Log Out"
          >
            Log Out
          </button>
        )}
      </div>
      {isAuthenticated ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
            <div className="lg:col-span-2">
              <h2 className="text-lg font-semibold mb-3 text-gray-800">Recent Orders</h2>
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative">
                  <button
                    onClick={() => setIsStatusOpen(!isStatusOpen)}
                    className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 text-xs hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                    aria-expanded={isStatusOpen}
                    aria-label="Filter by status"
                  >
                    <span>
                      {statuses.find((s) => s.value === status)?.label || 'Select Status'}
                    </span>
                    <ChevronDownIcon className="ml-1 h-4 w-4" />
                  </button>
                  {isStatusOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                      {statuses.map((stat) => (
                        <button
                          key={stat.value}
                          onClick={() => {
                            setStatus(stat.value);
                            setIsStatusOpen(false);
                          }}
                          className="block w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-indigo-50 focus:bg-indigo-100"
                          aria-label={`Filter by ${stat.label}`}
                        >
                          {stat.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <button
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 text-xs hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                    aria-expanded={isSortOpen}
                    aria-label="Sort orders"
                  >
                    <span>
                      {sortOptions.find((s) => s.value === sort)?.label || 'Sort By'}
                    </span>
                    <ChevronDownIcon className="ml-1 h-4 w-4" />
                  </button>
                  {isSortOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSort(option.value);
                            setIsSortOpen(false);
                          }}
                          className="block w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-indigo-50 focus:bg-indigo-100"
                          aria-label={`Sort by ${option.label}`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {isLoading ? (
                <p className="text-xs text-gray-600">Loading orders...</p>
              ) : filteredOrders.length === 0 ? (
                <p className="text-xs text-gray-600">No orders found.</p>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredOrders.slice(0, 3).map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              )}
            </div>
            <div>
              <div className="flex space-x-2 mb-3">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg ${
                    activeTab === 'profile'
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  aria-label="View profile"
                >
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg ${
                    activeTab === 'notifications'
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  aria-label="View notifications"
                >
                  Notifications
                </button>
              </div>
              {activeTab === 'profile' ? (
                <Profile />
              ) : (
                <>
                  <h2 className="text-lg font-semibold mb-3 text-gray-800">Recent Notifications</h2>
                  {isLoading ? (
                    <p className="text-xs text-gray-600">Loading notifications...</p>
                  ) : notifications.length === 0 ? (
                    <p className="text-xs text-gray-600">No notifications.</p>
                  ) : (
                    <ul className="space-y-2">
                      {notifications.slice(0, 3).map((notification) => (
                        <li
                          key={notification.id}
                          className="p-3 bg-white rounded-lg shadow-sm border border-gray-100"
                        >
                          <p className="text-xs text-gray-800">{notification.message}</p>
                          <small className="text-xs text-gray-500">
                            {new Date(notification.date).toLocaleDateString()}
                          </small>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-600 text-xs">Please sign in to view your dashboard.</p>
      )}
    </div>
  );
};

export default UserDashboard;