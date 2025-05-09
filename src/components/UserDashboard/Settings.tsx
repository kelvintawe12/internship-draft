import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';
import { RootState } from '../../store';
import {
  UserIcon,
  LockIcon,
  BellIcon,
  CreditCardIcon,
  GlobeIcon,
  CalendarIcon,
  MoonIcon,
  SunIcon,
  InfoIcon,
  CheckIcon,
  XIcon,
} from 'lucide-react';

interface UserSettings {
  name: string;
  email: string;
  phone: string;
  address: string;
  language: string;
  timezone: string;
  theme: 'light' | 'dark';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  twoFactorEnabled: boolean;
}

const Settings: React.FC = () => {
  const { isAuthenticated } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<UserSettings>({
    name: '',
    email: '',
    phone: '',
    address: '',
    language: 'en',
    timezone: 'Africa/Kigali',
    theme: 'light',
    notifications: { email: true, push: false, sms: false },
    twoFactorEnabled: false,
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchSettings = async () => {
        setIsLoading(true);
        try {
          const response = await fetch('/api/user/settings');
          const data = await response.json();
          setFormData(data);
        } catch (error) {
          toast.error('Failed to fetch settings.', { theme: 'light' });
        } finally {
          setIsLoading(false);
        }
      };
      fetchSettings();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);


  const validateForm = (section: string) => {
    const newErrors: { [key: string]: string } = {};
    if (section === 'profile') {
      if (!formData.name) newErrors.name = 'Name is required.';
      if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email is required.';
      if (formData.phone && !/^\+?\d{10,}$/.test(formData.phone)) newErrors.phone = 'Valid phone number is required.';
    } else if (section === 'security') {
      if (passwordData.newPassword && passwordData.newPassword.length < 8)
        newErrors.newPassword = 'Password must be at least 8 characters.';
      if (passwordData.newPassword !== passwordData.confirmPassword)
        newErrors.confirmPassword = 'Passwords do not match.';
      if (!passwordData.currentPassword) newErrors.currentPassword = 'Current password is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (section: string) => {
    if (!validateForm(section)) return;
    setShowModal(true);
  };

  const confirmSave = async (section: string) => {
    try {
      if (section === 'profile' || section === 'account' || section === 'notifications') {
        await fetch('/api/user/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        // Removed dispatch call since no user slice in store
        toast.success('Settings updated successfully!', { theme: 'light' });
      } else if (section === 'security') {
        await fetch('/api/user/password', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(passwordData),
        });
        toast.success('Password updated successfully!', { theme: 'light' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      toast.error('Failed to update settings.', { theme: 'light' });
    } finally {
      setShowModal(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <UserIcon className="w-4 h-4" /> },
    { id: 'account', label: 'Account', icon: <GlobeIcon className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <BellIcon className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <LockIcon className="w-4 h-4" /> },
    { id: 'billing', label: 'Billing', icon: <CreditCardIcon className="w-4 h-4" /> },
  ];

  const ConfirmationModal: React.FC<{ section: string }> = ({ section }) => (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      >
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Confirm Changes</h3>
        <p className="text-xs text-gray-600 mb-6">Are you sure you want to save your {section} settings?</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowModal(false)}
            className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs hover:bg-gray-300 focus:ring-2 focus:ring-gray-500"
            aria-label="Cancel"
          >
            Cancel
          </button>
          <button
            onClick={() => confirmSave(section)}
            className="bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-indigo-600 focus:ring-2 focus:ring-indigo-500"
            aria-label="Confirm"
          >
            Confirm
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  if (!isAuthenticated) {
    return (
      <div className="p-4 text-center">
        <p className="text-xs text-gray-600">Please sign in to view your settings.</p>
      </div>
    );
  }

  // Removed check for userSettings since it no longer exists in this component

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Settings</h2>
      {isLoading ? (
        <p className="text-xs text-gray-600">Loading settings...</p>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          {/* Tab Navigation */}
          <nav className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-t-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-indigo-500 text-white'
                    : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
                }`}
                aria-current={activeTab === tab.id ? 'page' : undefined}
                aria-label={`Switch to ${tab.label} settings`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'profile' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-800">Profile Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-600">Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full p-2 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
                        aria-label="Name"
                      />
                      {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full p-2 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
                        aria-label="Email"
                      />
                      {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full p-2 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
                        aria-label="Phone"
                      />
                      {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Address</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full p-2 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
                        aria-label="Address"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => handleSave('profile')}
                      className="bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs hover:bg-indigo-600 focus:ring-2 focus:ring-indigo-500"
                      aria-label="Save profile settings"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'account' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-800">Account Preferences</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-600 flex items-center gap-1">
                        Language
                        <InfoIcon className="w-3 h-3 text-gray-400" aria-label="Select your preferred language" />
                      </label>
                      <select
                        value={formData.language}
                        onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                        className="w-full p-2 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
                        aria-label="Language"
                      >
                        <option value="en">English</option>
                        <option value="fr">French</option>
                        <option value="rw">Kinyarwanda</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 flex items-center gap-1">
                        Timezone
                        <InfoIcon className="w-3 h-3 text-gray-400" aria-label="Select your timezone" />
                      </label>
                      <select
                        value={formData.timezone}
                        onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                        className="w-full p-2 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
                        aria-label="Timezone"
                      >
                        <option value="Africa/Kigali">Africa/Kigali</option>
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">America/New_York</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 flex items-center gap-1">
                        Theme
                        <InfoIcon className="w-3 h-3 text-gray-400" aria-label="Choose light or dark theme" />
                      </label>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setFormData({ ...formData, theme: 'light' })}
                          className={`p-2 rounded-lg flex items-center gap-2 text-xs ${
                            formData.theme === 'light' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'
                          }`}
                          aria-label="Select light theme"
                        >
                          <SunIcon className="w-4 h-4" /> Light
                        </button>
                        <button
                          onClick={() => setFormData({ ...formData, theme: 'dark' })}
                          className={`p-2 rounded-lg flex items-center gap-2 text-xs ${
                            formData.theme === 'dark' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'
                          }`}
                          aria-label="Select dark theme"
                        >
                          <MoonIcon className="w-4 h-4" /> Dark
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => handleSave('account')}
                      className="bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs hover:bg-indigo-600 focus:ring-2 focus:ring-indigo-500"
                      aria-label="Save account settings"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-800">Notification Preferences</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-xs text-gray-600">
                      <input
                        type="checkbox"
                        checked={formData.notifications.email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            notifications: { ...formData.notifications, email: e.target.checked },
                          })
                        }
                        className="h-4 w-4 text-indigo-500 focus:ring-indigo-500"
                        aria-label="Email notifications"
                      />
                      Email Notifications
                    </label>
                    <label className="flex items-center gap-2 text-xs text-gray-600">
                      <input
                        type="checkbox"
                        checked={formData.notifications.push}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            notifications: { ...formData.notifications, push: e.target.checked },
                          })
                        }
                        className="h-4 w-4 text-indigo-500 focus:ring-indigo-500"
                        aria-label="Push notifications"
                      />
                      Push Notifications
                    </label>
                    <label className="flex items-center gap-2 text-xs text-gray-600">
                      <input
                        type="checkbox"
                        checked={formData.notifications.sms}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            notifications: { ...formData.notifications, sms: e.target.checked },
                          })
                        }
                        className="h-4 w-4 text-indigo-500 focus:ring-indigo-500"
                        aria-label="SMS notifications"
                      />
                      SMS Notifications
                    </label>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => handleSave('notifications')}
                      className="bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs hover:bg-indigo-600 focus:ring-2 focus:ring-indigo-500"
                      aria-label="Save notification settings"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-800">Security Settings</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-600">Current Password</label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, currentPassword: e.target.value })
                        }
                        className="w-full p-2 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
                        aria-label="Current password"
                      />
                      {errors.currentPassword && (
                        <p className="text-xs text-red-500 mt-1">{errors.currentPassword}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">New Password</label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, newPassword: e.target.value })
                        }
                        className="w-full p-2 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
                        aria-label="New password"
                      />
                      {errors.newPassword && (
                        <p className="text-xs text-red-500 mt-1">{errors.newPassword}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Confirm New Password</label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                        }
                        className="w-full p-2 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
                        aria-label="Confirm new password"
                      />
                      {errors.confirmPassword && (
                        <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 flex items-center gap-1">
                        Two-Factor Authentication
                        <InfoIcon className="w-3 h-3 text-gray-400" aria-label="Enable 2FA for extra security" />
                      </label>
                      <button
                        onClick={() =>
                          setFormData({ ...formData, twoFactorEnabled: !formData.twoFactorEnabled })
                        }
                        className={`p-2 rounded-lg flex items-center gap-2 text-xs ${
                          formData.twoFactorEnabled ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'
                        }`}
                        aria-label={formData.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                      >
                        {formData.twoFactorEnabled ? (
                          <CheckIcon className="w-4 h-4" />
                        ) : (
                          <XIcon className="w-4 h-4" />
                        )}
                        {formData.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => handleSave('security')}
                      className="bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs hover:bg-indigo-600 focus:ring-2 focus:ring-indigo-500"
                      aria-label="Save security settings"
                    >
                      Save
                    </button>
                  </div>
                  <div className="mt-6">
                    <h4 className="text-xs font-semibold text-gray-800 mb-2">Recent Login Activity</h4>
                    <ul className="space-y-2">
                      {[
                        { device: 'Chrome on Windows', date: '2025-05-08', ip: '192.168.1.1' },
                        { device: 'Safari on iPhone', date: '2025-05-07', ip: '192.168.1.2' },
                      ].map((activity, index) => (
                        <li key={index} className="p-3 bg-gray-50 rounded-lg text-xs">
                          <p className="text-gray-800">{activity.device}</p>
                          <p className="text-gray-500">
                            {activity.date} • IP: {activity.ip}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'billing' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-800">Billing Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-600">Card Number</label>
                      <input
                        type="text"
                        placeholder="**** **** **** ****"
                        className="w-full p-2 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
                        aria-label="Card number"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full p-2 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
                        aria-label="Expiry date"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Cardholder Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full p-2 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
                        aria-label="Cardholder name"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">CVV</label>
                      <input
                        type="text"
                        placeholder="***"
                        className="w-full p-2 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
                        aria-label="CVV"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => handleSave('billing')}
                      className="bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs hover:bg-indigo-600 focus:ring-2 focus:ring-indigo-500"
                      aria-label="Save billing information"
                    >
                      Save
                    </button>
                  </div>
                  <div className="mt-6">
                    <h4 className="text-xs font-semibold text-gray-800 mb-2">Billing History</h4>
                    <ul className="space-y-2">
                      {[
                        { id: 'INV-001', date: '2025-05-01', amount: 50000, status: 'Paid' },
                        { id: 'INV-002', date: '2025-04-15', amount: 75000, status: 'Pending' },
                      ].map((invoice) => (
                        <li key={invoice.id} className="p-3 bg-gray-50 rounded-lg text-xs">
                          <p className="text-gray-800">Invoice #{invoice.id}</p>
                          <p className="text-gray-500">
                            {invoice.date} • RWF {invoice.amount} • {invoice.status}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
      {showModal && <ConfirmationModal section={activeTab} />}
    </div>
  );
};

export default Settings;