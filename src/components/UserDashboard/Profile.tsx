import React, { useEffect, useState } from 'react';
import ErrorBoundary from '../ErrorBoundary';

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

const Profile: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/user/profile');
        if (!response.ok) throw new Error('Failed to fetch profile');
        const data: UserProfile = await response.json();
        setProfile(data);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return <p className="text-xs text-gray-600 p-4">Loading profile...</p>;
  }

  if (error) {
    return <p className="text-xs text-red-500 p-4">Error: {error}</p>;
  }

  if (!profile) {
    return <p className="text-xs text-gray-600 p-4">No profile data available.</p>;
  }

  return (
    <ErrorBoundary>
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-3 text-gray-800">Profile</h2>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 max-w-md">
          <p className="text-xs"><strong>Name:</strong> {profile.name}</p>
          <p className="text-xs"><strong>Email:</strong> {profile.email}</p>
          {profile.phone && <p className="text-xs"><strong>Phone:</strong> {profile.phone}</p>}
          {profile.address && <p className="text-xs"><strong>Address:</strong> {profile.address}</p>}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Profile;
