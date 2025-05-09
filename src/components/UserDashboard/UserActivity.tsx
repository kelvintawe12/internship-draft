import React, { useState, useContext } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { useForm, SubmitHandler } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { Activity, Filter, X, LogIn, User, MessageCircle } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import ErrorBoundary from '../ErrorBoundary';
import { setActivities } from '../../store/activitySlice';

interface Activity {
  id: string;
  description: string;
  date: string;
  type: 'login' | 'update' | 'comment';
}

interface FilterFormData {
  search: string;
  dateFrom: string;
  dateTo: string;
}

const fetchActivities = async (page: number, filters: FilterFormData) => {
  const params = new URLSearchParams({
    page: page.toString(),
    search: filters.search,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
  });
  const response = await fetch(`/api/user/activity?${params}`);
  if (!response.ok) throw new Error('Failed to fetch user activity');
  return response.json();
};

const UserActivity: React.FC = () => {
  const { user } = useContext(AuthContext);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const activities = useSelector((state: RootState) => state.activity.activities) as Activity[];
  const [page, setPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { register, handleSubmit, watch, reset } = useForm<FilterFormData>({
    defaultValues: {
      search: '',
      dateFrom: '',
      dateTo: '',
    },
  });

  const filters = watch();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['activities', page, filters],
    queryFn: () => fetchActivities(page, filters),
  });

  React.useEffect(() => {
    if (data) {
      dispatch(setActivities(data));
    }
  }, [data, dispatch]);

  const onFilterSubmit: SubmitHandler<FilterFormData> = () => {
    setPage(1);
    refetch();
  };

  const getIconForType = (type: Activity['type']) => {
    switch (type) {
      case 'login':
        return <LogIn className="w-5 h-5 text-blue-500" />;
      case 'update':
        return <User className="w-5 h-5 text-green-500" />;
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-purple-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 bg-white shadow-lg rounded-xl max-w-3xl mx-auto"
      >
        <p className="text-sm text-gray-600 text-center">Loading user activity...</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 bg-white shadow-lg rounded-xl max-w-3xl mx-auto"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">User Activity</h2>
        <div className="text-center">
          <p className="text-sm text-red-600 mb-4">Error: {(error as Error)?.message}</p>
          <button
            onClick={() => refetch()}
            className="flex items-center mx-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            aria-label="Retry fetching user activity"
          >
            <X className="w-4 h-4 mr-2" />
            Retry
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <ErrorBoundary>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 bg-white shadow-lg rounded-xl max-w-3xl mx-auto"
        role="region"
        aria-label="User Activity"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">User Activity</h2>
        <p className="text-sm text-gray-600 mb-6">View your recent account activities and interactions.</p>

        {/* Filter Panel */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Activities</h3>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
            aria-expanded={isFilterOpen}
            aria-controls="filter-panel"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
        </div>
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
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                    Search
                  </label>
                  <input
                    id="search"
                    {...register('search')}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Search activities..."
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

        {/* Activities List */}
        {activities.length === 0 ? (
          <p className="text-sm text-gray-600 text-center">No activities found.</p>
        ) : (
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            {activities.map((activity) => (
              <motion.li
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 bg-white rounded-lg shadow-sm border flex items-start space-x-3 hover:bg-gray-50 transition-colors"
                role="article"
                aria-labelledby={`activity-${activity.id}`}
              >
                <div className="flex-shrink-0">{getIconForType(activity.type)}</div>
                <div>
                  <p id={`activity-${activity.id}`} className="text-sm text-gray-800">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500">{new Date(activity.date).toLocaleString()}</p>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        )}

        {/* Pagination */}
        {activities.length > 0 && (
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setPage((prev) => prev + 1);
                refetch();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              disabled={isLoading || activities.length < 10}
              aria-label="Load more activities"
            >
              Load More
            </button>
          </div>
        )}
      </motion.div>
    </ErrorBoundary>
  );
};

export default UserActivity;