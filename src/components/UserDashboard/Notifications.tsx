import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { toast } from 'react-toastify';
import { setNotifications, updateNotification } from '../../store/notificationSlice';
import { motion } from 'framer-motion';

interface Notification {
  id: string;
  message: string;
  date: string;
  read: boolean;
}

const Notifications: React.FC = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.notification.notifications);

  const { isLoading, error } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await fetch('/api/notifications');
      if (!response.ok) throw new Error('Failed to fetch notifications');
      const data = await response.json();
      dispatch(setNotifications(data));
      return data;
    },
  });

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, { method: 'PATCH' });
      if (!response.ok) throw new Error('Failed to mark as read');
      dispatch(updateNotification({ id, read: true }));
    } catch (error) {
      toast.error('Failed to mark notification as read.', { theme: 'light' });
    }
  };

  if (error) {
    toast.error('Failed to fetch notifications.', { theme: 'light' });
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">Notifications</h2>
      {isLoading ? (
        <p className="text-xs text-gray-600">Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p className="text-xs text-gray-600">No notifications.</p>
      ) : (
        <motion.ul
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-2"
        >
          {notifications.map((notification) => (
            <motion.li
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className={`p-3 bg-white rounded-lg shadow-sm border border-gray-100 cursor-pointer ${
                notification.read ? 'opacity-75' : 'font-semibold'
              }`}
              onClick={() => !notification.read && markAsRead(notification.id)}
            >
              <p className="text-xs text-gray-800">{notification.message}</p>
              <small className="text-xs text-gray-500">
                {new Date(notification.date).toLocaleDateString()}
              </small>
              <span className="text-xs text-gray-500"> ({notification.read ? 'Read' : 'Unread'})</span>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </div>
  );
};

export default Notifications;