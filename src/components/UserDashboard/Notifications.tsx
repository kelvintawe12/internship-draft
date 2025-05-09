import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { toast } from 'react-toastify';

interface Notification {
  id: string; // Changed from number to string to match actual data type
  message: string;
  date: string;
}

const Notifications: React.FC = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.notification.notifications as Notification[]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/notifications');
        const data = await response.json();
        dispatch({ type: 'notification/setNotifications', payload: data });
      } catch (error) {
        toast.error('Failed to fetch notifications.', { theme: 'light' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotifications();
  }, [dispatch]);

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">Notifications</h2>
      {isLoading ? (
        <p className="text-xs text-gray-600">Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p className="text-xs text-gray-600">No notifications.</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map((notification) => (
            <li key={notification.id} className="p-3 bg-white rounded-lg shadow-sm border border-gray-100">
              <p className="text-xs text-gray-800">{notification.message}</p>
              <small className="text-xs text-gray-500">{new Date(notification.date).toLocaleDateString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;