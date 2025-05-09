import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Bell, Info, AlertTriangle, XCircle, Filter, CheckCircle, Trash2, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { setNotifications, updateNotification, clearNotifications } from '../../store/notificationSlice';

interface Notification {
  id: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'warning' | 'error';
  priority: 'low' | 'medium' | 'high';
}

interface FilterFormData {
  status: 'all' | 'read' | 'unread';
  search: string;
  dateFrom: string;
  dateTo: string;
}

const fetchNotifications = async (page: number, filters: FilterFormData) => {
  const params = new URLSearchParams({
    page: page.toString(),
    status: filters.status,
    search: filters.search,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
  });
  const response = await fetch(`/api/notifications?${params}`);
  if (!response.ok) throw new Error('Failed to fetch notifications');
  return response.json();
};

const markAsRead = async (id: string) => {
  const response = await fetch(`/api/notifications/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ read: true }),
  });
  if (!response.ok) throw new Error('Failed to mark as read');
  return response.json();
};

const clearAllNotifications = async () => {
  const response = await fetch('/api/notifications', {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to clear notifications');
  return response.json();
};

const Notifications: React.FC = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const notifications = useSelector((state: RootState) => state.notification.notifications) as Notification[];
  const [page, setPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { register, handleSubmit, watch, reset } = useForm<FilterFormData>({
    defaultValues: {
      status: 'all',
      search: '',
      dateFrom: '',
      dateTo: '',
    },
  });

  const filters = watch();

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ['notifications', page, filters],
    queryFn: () => fetchNotifications(page, filters),
  });

  useEffect(() => {
    if (data) {
      dispatch(setNotifications(data));
    }
  }, [data, dispatch]);

  const markAsReadMutation = useMutation({
    mutationFn: markAsRead,
    onSuccess: (_, id) => {
      dispatch(updateNotification({ id, read: true }));
      toast.success('Notification marked as read.', { theme: 'light' });
    },
    onError: () => {
      toast.error('Failed to mark notification as read.', { theme: 'light' });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
      await Promise.all(unreadIds.map((id) => markAsRead(id)));
    },
    onSuccess: () => {
      dispatch(setNotifications(notifications.map((n) => ({ ...n, read: true }))));
      toast.success('All notifications marked as read.', { theme: 'light' });
    },
    onError: () => {
      toast.error('Failed to mark all notifications as read.', { theme: 'light' });
    },
  });

  const clearAllMutation = useMutation({
    mutationFn: clearAllNotifications,
    onSuccess: () => {
      dispatch(clearNotifications());
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('All notifications cleared.', { theme: 'light' });
    },
    onError: () => {
      toast.error('Failed to clear notifications.', { theme: 'light' });
    },
  });

  const onFilterSubmit: SubmitHandler<FilterFormData> = () => {
    setPage(1);
    refetch();
  };

  const getIconForType = (type: Notification['type']) => {
    switch (type) {
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-l-4 border-red-500';
      case 'medium':
        return 'border-l-4 border-yellow-500';
      case 'low':
        return 'border-l-4 border-green-500';
      default:
        return '';
    }
  };

  if (error) {
    return (
      <div className="p-6 bg-white shadow-lg rounded-xl max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Notifications</h2>
        <div className="text-center">
          <p className="text-sm text-red-600 mb-4">Failed to fetch notifications.</p>
          <button
            onClick={() => refetch()}
            className="flex items-center mx-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            aria-label="Retry fetching notifications"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-white shadow-lg rounded-xl max-w-3xl mx-auto"
      role="region"
      aria-label="Notifications"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
            aria-expanded={isFilterOpen}
            aria-controls="filter-panel"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
          {notifications.length > 0 && (
            <>
              <button
                onClick={() => markAllAsReadMutation.mutate()}
                className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                disabled={markAllAsReadMutation.isPending || notifications.every((n) => n.read)}
                aria-label="Mark all notifications as read"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {markAllAsReadMutation.isPending ? 'Marking...' : 'Mark All as Read'}
              </button>
              <button
                onClick={() => clearAllMutation.mutate()}
                className="flex items-center px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                disabled={clearAllMutation.isPending}
                aria-label="Clear all notifications"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {clearAllMutation.isPending ? 'Clearing...' : 'Clear All'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            id="filter-panel"
            className="bg-gray-50 p-4 rounded-lg mb-6"
          >
            <form onSubmit={handleSubmit(onFilterSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  {...register('status')}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="all">All</option>
                  <option value="read">Read</option>
                  <option value="unread">Unread</option>
                </select>
              </div>
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                  Search
                </label>
                <input
                  id="search"
                  {...register('search')}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Search notifications..."
                />
              </div>
              <div>
                <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700">
                  From Date
                </label>
                <input
                  id="dateFrom"
                  type="date"
                  {...register('dateFrom')}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700">
                  To Date
                </label>
                <input
                  id="dateTo"
                  type="date"
                  {...register('dateTo')}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              <div className="md:col-span-2 flex space-x-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  aria-label="Apply filters"
                >
                  Apply Filters
                </button>
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setPage(1);
                    refetch();
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
                  aria-label="Reset filters"
                >
                  Reset
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications List */}
      {isLoading ? (
        <p className="text-sm text-gray-600 text-center">Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p className="text-sm text-gray-600 text-center">No notifications found.</p>
      ) : (
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          {notifications.map((notification) => (
            <motion.li
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className={`p-4 bg-white rounded-lg shadow-sm border ${getPriorityColor(notification.priority)} flex items-start space-x-3 hover:bg-gray-50 transition-colors ${
                notification.read ? 'opacity-75' : ''
              }`}
              role="article"
              aria-labelledby={`notification-${notification.id}`}
            >
              <div className="flex-shrink-0">{getIconForType(notification.type)}</div>
              <div className="flex-1">
                <p id={`notification-${notification.id}`} className="text-sm text-gray-800">
                  {notification.message}
                </p>
                <div className="mt-1 flex items-center space-x-2 text-xs text-gray-500">
                  <span>{new Date(notification.date).toLocaleString()}</span>
                  <span>•</span>
                  <span>{notification.read ? 'Read' : 'Unread'}</span>
                  <span>•</span>
                  <span>Priority: {notification.priority.charAt(0).toUpperCase() + notification.priority.slice(1)}</span>
                </div>
              </div>
              {!notification.read && (
                <button
                  onClick={() => markAsReadMutation.mutate(notification.id)}
                  className="flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  disabled={markAsReadMutation.isPending}
                  aria-label={`Mark notification ${notification.id} as read`}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Mark as Read
                </button>
              )}
            </motion.li>
          ))}
        </motion.ul>
      )}

      {/* Pagination */}
      {notifications.length > 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setPage((prev) => prev + 1);
              refetch();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            disabled={isLoading || notifications.length < 10} // Assume 10 items per page
            aria-label="Load more notifications"
          >
            Load More
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default Notifications;