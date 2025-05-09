import React, { useEffect, useState } from 'react';
import ErrorBoundary from '../ErrorBoundary';

const UserSecurity: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  useEffect(() => {
    const fetchSecuritySettings = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/user/security');
        if (!response.ok) throw new Error('Failed to fetch security settings');
        const data = await response.json();
        setTwoFactorEnabled(data.twoFactorEnabled);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchSecuritySettings();
  }, []);

  const toggleTwoFactor = async () => {
    try {
      const response = await fetch('/api/user/security/two-factor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !twoFactorEnabled }),
      });
      if (!response.ok) throw new Error('Failed to update two-factor authentication');
      setTwoFactorEnabled(!twoFactorEnabled);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  if (loading) {
    return <p className="text-xs text-gray-600 p-4">Loading security settings...</p>;
  }

  if (error) {
    return <p className="text-xs text-red-500 p-4">Error: {error}</p>;
  }

  return (
    <ErrorBoundary>
      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-4">Security Settings</h2>
        <p>Manage your security settings such as password, two-factor authentication, and login alerts.</p>
        <div className="mt-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={twoFactorEnabled}
              onChange={toggleTwoFactor}
              aria-label="Enable two-factor authentication"
            />
            Enable Two-Factor Authentication
          </label>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default UserSecurity;
