import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';

const Profile: React.FC = () => {
  const { user, loading } = useContext(AuthContext);

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
      {loading ? (
        <p className="text-xs text-gray-600">Loading profile...</p>
      ) : !user ? (
        <p className="text-xs text-gray-600">No profile data available.</p>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <img
              src="https://example.com/avatar.jpg"
              alt="Avatar"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-medium text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-500">@{user.email.split('@')[0]}</p>
            </div>
          </div>
          <p className="text-xs text-gray-600">Email: {user.email}</p>
          <p className="text-xs text-gray-600">Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
          <p className="text-xs text-gray-500">Joined: {new Date().toLocaleDateString()}</p>
        </div>
      )}
    </motion.div>
  );
};

export default Profile;