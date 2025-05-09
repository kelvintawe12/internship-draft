import React, { useEffect, useState } from 'react';
import ErrorBoundary from '../ErrorBoundary';

interface Activity {
  id: number;
  description: string;
  date: string;
}

const UserActivity: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/user/activity');
        if (!response.ok) throw new Error('Failed to fetch user activity');
        const data: Activity[] = await response.json();
        setActivities(data);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  if (loading) {
    return <p className="text-xs text-gray-600 p-4">Loading user activity...</p>;
  }

  if (error) {
    return <p className="text-xs text-red-500 p-4">Error: {error}</p>;
  }

  if (activities.length === 0) {
    return <p className="text-xs text-gray-600 p-4">No user activity found.</p>;
  }

  return (
    <ErrorBoundary>
      <div>
        <h2 className="text-2xl font-semibold mb-4">User Activity</h2>
        <ul className="list-disc list-inside">
          {activities.map((activity) => (
            <li key={activity.id}>
              {activity.description} - <span className="text-gray-500">{activity.date}</span>
            </li>
          ))}
        </ul>
      </div>
    </ErrorBoundary>
  );
};

export default UserActivity;
