import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { toast } from 'react-toastify';
import { setUser } from '../../store/userSlice';
import { motion } from 'framer-motion';

interface UserProfile {
  username: string;
  fullName: string;
  avatar: string;
  bio: string;
  joinedDate: string;
}

const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.profile);

  const { isLoading, error } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const response = await fetch('/api/user/profile');
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = await response.json();
      dispatch(setUser(data));
      return data;
    },
  });

  if (error) {
    toast.error('Failed to fetch profile.', { theme: 'light' });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-sm rounded-lg p-4 border border-gray-100"
      role="region"
      aria-label="User Profile"
    >
      <h2 className="text-lg font-semibold mb-3 text-gray-800">Profile</h2>
      {isLoading ? (
        <p className="text-xs text-gray-600">Loading profile...</p>
      ) : !user ? (
        <p className="text-xs text-gray-600">No profile data available.</p>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <img
              src={user.avatar}
              alt="Avatar"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-medium text-gray-800">{user.fullName}</p>
              <p className="text-xs text-gray-500">@{user.username}</p>
            </div>
          </div>
          <p className="text-xs text-gray-600">{user.bio}</p>
          <p className="text-xs text-gray-500">
            Joined: {new Date(user.joinedDate).toLocaleDateString()}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default Profile;