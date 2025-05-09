import React, { useState, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { useForm, SubmitHandler } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { Lock, Shield, LogOut, Mail, QrCode, CheckCircle, X } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import ErrorBoundary from '../ErrorBoundary';
import { setSecuritySettings, updateSession } from '../../store/securitySlice';

interface SecuritySettings {
  twoFactorEnabled: boolean;
  loginAlertsEnabled: boolean;
}

interface Session {
  id: string;
  device: string;
  ip: string;
  lastActive: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const fetchSecuritySettings = async () => {
  const response = await fetch('/api/user/security');
  if (!response.ok) throw new Error('Failed to fetch security settings');
  return response.json();
};

const updateTwoFactor = async (enabled: boolean) => {
  const response = await fetch('/api/user/security/two-factor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ enabled }),
  });
  if (!response.ok) throw new Error('Failed to update two-factor authentication');
  return response.json();
};

const updateLoginAlerts = async (enabled: boolean) => {
  const response = await fetch('/api/user/security/login-alerts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ enabled }),
  });
  if (!response.ok) throw new Error('Failed to update login alerts');
  return response.json();
};

const updatePassword = async (data: PasswordFormData) => {
  const response = await fetch('/api/user/password', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update password');
  return response.json();
};

const fetchSessions = async () => {
  const response = await fetch('/api/user/sessions');
  if (!response.ok) throw new Error('Failed to fetch sessions');
  return response.json();
};

const logoutSession = async (sessionId: string) => {
  const response = await fetch(`/api/user/sessions/${sessionId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to log out session');
  return response.json();
};

const UserSecurity: React.FC = () => {
  const { user } = useContext(AuthContext);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const securitySettings = useSelector((state: RootState) => state.security) as SecuritySettings;
  const [showTwoFactorConfirm, setShowTwoFactorConfirm] = useState(false);
  const [twoFactorAction, setTwoFactorAction] = useState<boolean | null>(null);
  const [showQrCode, setShowQrCode] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<PasswordFormData>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPassword = watch('newPassword');

  const { data: settings, isLoading: settingsLoading, error: settingsError, refetch: refetchSettings } = useQuery({
    queryKey: ['securitySettings'],
    queryFn: async () => {
      const data = await fetchSecuritySettings();
      dispatch(setSecuritySettings(data));
      return data;
    },
  });

  const { data: sessions, isLoading: sessionsLoading, error: sessionsError, refetch: refetchSessions } = useQuery({
    queryKey: ['sessions'],
    queryFn: fetchSessions,
  });

  const twoFactorMutation = useMutation({
    mutationFn: updateTwoFactor,
    onSuccess: (data) => {
      dispatch(setSecuritySettings({ ...securitySettings, twoFactorEnabled: data.twoFactorEnabled }));
      setShowTwoFactorConfirm(false);
      setShowQrCode(data.twoFactorEnabled);
      toast.success(`Two-factor authentication ${data.twoFactorEnabled ? 'enabled' : 'disabled'}.`, { theme: 'light' });
    },
    onError: () => {
      toast.error('Failed to update two-factor authentication.', { theme: 'light' });
    },
  });

  const loginAlertsMutation = useMutation({
    mutationFn: updateLoginAlerts,
    onSuccess: (data) => {
      dispatch(setSecuritySettings({ ...securitySettings, loginAlertsEnabled: data.loginAlertsEnabled }));
      toast.success(`Login alerts ${data.loginAlertsEnabled ? 'enabled' : 'disabled'}.`, { theme: 'light' });
    },
    onError: () => {
      toast.error('Failed to update login alerts.', { theme: 'light' });
    },
  });

  const passwordMutation = useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      reset();
      toast.success('Password updated successfully.', { theme: 'light' });
    },
    onError: () => {
      toast.error('Failed to update password.', { theme: 'light' });
    },
  });

  const logoutSessionMutation = useMutation({
    mutationFn: logoutSession,
    onSuccess: (_, sessionId) => {
      dispatch(updateSession({ id: sessionId, active: false }));
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast.success('Session logged out.', { theme: 'light' });
    },
    onError: () => {
      toast.error('Failed to log out session.', { theme: 'light' });
    },
  });

  const onPasswordSubmit: SubmitHandler<PasswordFormData> = (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('New password and confirmation do not match.', { theme: 'light' });
      return;
    }
    passwordMutation.mutate(data);
  };

  const handleTwoFactorToggle = (enabled: boolean) => {
    setTwoFactorAction(enabled);
    setShowTwoFactorConfirm(true);
  };

  const confirmTwoFactor = () => {
    if (twoFactorAction !== null) {
      twoFactorMutation.mutate(twoFactorAction);
    }
  };

  if (settingsLoading || sessionsLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 bg-white shadow-lg rounded-xl max-w-3xl mx-auto"
      >
        <p className="text-sm text-gray-600 text-center">Loading security settings...</p>
      </motion.div>
    );
  }

  if (settingsError || sessionsError) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 bg-white shadow-lg rounded-xl max-w-3xl mx-auto"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Security Settings</h2>
        <div className="text-center">
          <p className="text-sm text-red-600 mb-4">Error: {(settingsError as Error)?.message || (sessionsError as Error)?.message}</p>
          <button
            onClick={() => {
              refetchSettings();
              refetchSessions();
            }}
            className="flex items-center mx-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            aria-label="Retry fetching security settings"
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
        aria-label="Security Settings"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Security Settings</h2>
        <p className="text-sm text-gray-600 mb-6">Manage your account security, including two-factor authentication, password, sessions, and login alerts.</p>

        {/* Two-Factor Authentication */}
        <section className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-blue-500" />
            Two-Factor Authentication
          </h3>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={securitySettings.twoFactorEnabled}
              onChange={(e) => handleTwoFactorToggle(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
              aria-label="Enable two-factor authentication"
              disabled={twoFactorMutation.isPending}
            />
            Enable Two-Factor Authentication
          </label>
          {showQrCode && securitySettings.twoFactorEnabled && (
            <div className="mt-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <p className="text-sm text-gray-600 mb-2">Scan this QR code with your authenticator app:</p>
              <div className="w-32 h-32 bg-gray-200 flex items-center justify-center rounded-md">
                <QrCode className="w-24 h-24 text-gray-500" />
              </div>
              <button
                onClick={() => setShowQrCode(false)}
                className="mt-2 text-sm text-blue-600 hover:underline"
                aria-label="Hide QR code"
              >
                Hide QR Code
              </button>
            </div>
          )}
        </section>

        {/* Password Change */}
        <section className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Lock className="w-5 h-5 mr-2 text-blue-500" />
            Change Password
          </h3>
          <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <input
                id="currentPassword"
                type="password"
                {...register('currentPassword', { required: 'Current password is required' })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                aria-invalid={errors.currentPassword ? 'true' : 'false'}
              />
              {errors.currentPassword && <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>}
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                {...register('newPassword', {
                  required: 'New password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' },
                })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                aria-invalid={errors.newPassword ? 'true' : 'false'}
              />
              {errors.newPassword && <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword', {
                  required: 'Please confirm your new password',
                  validate: (value) => value === newPassword || 'Passwords do not match',
                })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                aria-invalid={errors.confirmPassword ? 'true' : 'false'}
              />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
            </div>
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              disabled={passwordMutation.isPending}
              aria-label="Update password"
            >
              <Lock className="w-4 h-4 mr-2" />
              {passwordMutation.isPending ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </section>

        {/* Session Management */}
        <section className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <LogOut className="w-5 h-5 mr-2 text-blue-500" />
            Active Sessions
          </h3>
          {sessions?.length ? (
            <ul className="space-y-3">
              {sessions.map((session: Session) => (
                <li key={session.id} className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm border border-gray-100">
                  <div>
                    <p className="text-sm text-gray-800">{session.device}</p>
                    <p className="text-xs text-gray-500">IP: {session.ip} • Last Active: {new Date(session.lastActive).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => logoutSessionMutation.mutate(session.id)}
                    className="flex items-center px-2 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs"
                    disabled={logoutSessionMutation.isPending}
                    aria-label={`Log out session ${session.id}`}
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    Log Out
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-600">No active sessions found.</p>
          )}
        </section>

        {/* Login Alerts */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Mail className="w-5 h-5 mr-2 text-blue-500" />
            Login Alerts
          </h3>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={securitySettings.loginAlertsEnabled}
              onChange={(e) => loginAlertsMutation.mutate(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
              aria-label="Enable login alerts"
              disabled={loginAlertsMutation.isPending}
            />
            Receive email alerts for suspicious login attempts
          </label>
        </section>

        {/* Two-Factor Confirmation Dialog */}
        <AnimatePresence>
          {showTwoFactorConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              role="dialog"
              aria-labelledby="two-factor-confirm-title"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full"
              >
                <h3 id="two-factor-confirm-title" className="text-lg font-semibold text-gray-800 mb-4">
                  Confirm Two-Factor Authentication
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Are you sure you want to {twoFactorAction ? 'enable' : 'disable'} two-factor authentication?{' '}
                  {twoFactorAction ? 'You will need to scan a QR code with your authenticator app.' : 'This will reduce your account security.'}
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={confirmTwoFactor}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    aria-label="Confirm two-factor action"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirm
                  </button>
                  <button
                    onClick={() => setShowTwoFactorConfirm(false)}
                    className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
                    aria-label="Cancel two-factor action"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </ErrorBoundary>
  );
};

export default UserSecurity;