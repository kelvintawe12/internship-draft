import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Edit2, Save, X, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

interface ProfileFormData {
  name: string;
  phone: string;
  address: string;
  bio: string;
  avatar: string;
  website: string;
  socialLinks: {
    twitter: string;
    linkedin: string;
  };
  language: string;
  timezone: string;
  preferredCurrency: string;
  notificationPreferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

const fetchProfile = async () => {
  const response = await fetch('/api/user/profile');
  if (!response.ok) throw new Error('Failed to fetch profile');
  return response.json();
};

const fetchSettings = async () => {
  const response = await fetch('/api/user/settings');
  if (!response.ok) throw new Error('Failed to fetch settings');
  return response.json();
};

const updateProfile = async (data: Partial<ProfileFormData>) => {
  const response = await fetch('/api/user/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update profile');
  return response.json();
};

const updateSettings = async (data: Partial<ProfileFormData>) => {
  const response = await fetch('/api/user/settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update settings');
  return response.json();
};

const Profile: React.FC = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [isSocialLinksOpen, setIsSocialLinksOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  });

  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: fetchSettings,
  });

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<ProfileFormData>({
    defaultValues: {
      name: settings?.name || user?.name || '',
      phone: settings?.phone || '',
      address: settings?.address || '',
      bio: profile?.bio || '',
      avatar: profile?.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
      website: profile?.website || '',
      socialLinks: {
        twitter: profile?.socialLinks?.twitter || '',
        linkedin: profile?.socialLinks?.linkedin || '',
      },
      language: settings?.language || 'en',
      timezone: settings?.timezone || 'Africa/Kigali',
      preferredCurrency: settings?.preferredCurrency || 'RWF',
      notificationPreferences: {
        email: settings?.notificationPreferences?.email || true,
        push: settings?.notificationPreferences?.push || false,
        sms: settings?.notificationPreferences?.sms || false,
      },
    },
  });

  const avatarUrl = watch('avatar');

  const mutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      await Promise.all([
        updateSettings({
          name: data.name,
          phone: data.phone,
          address: data.address,
          language: data.language,
          timezone: data.timezone,
          preferredCurrency: data.preferredCurrency,
          notificationPreferences: data.notificationPreferences,
        }),
        updateProfile({
          bio: data.bio,
          avatar: data.avatar,
          website: data.website,
          socialLinks: data.socialLinks,
        }),
      ]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    },
    onError: () => {
      toast.error('Failed to update profile. Please try again.');
    },
  });

  const onSubmit: SubmitHandler<ProfileFormData> = (data) => {
    mutation.mutate(data);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsSocialLinksOpen(false);
    reset();
  };

  const loading = authLoading || profileLoading || settingsLoading;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-lg rounded-xl p-8 max-w-3xl mx-auto border border-gray-100"
      role="region"
      aria-label="User Profile"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Your Profile</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            aria-label="Edit profile"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Profile
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-gray-600">Loading profile...</p>
      ) : !user ? (
        <p className="text-sm text-gray-600">No profile data available.</p>
      ) : (
        <div className="space-y-6">
          {/* View Mode */}
          {!isEditing ? (
            <div className="space-y-6">
              {/* Personal Info */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={profile?.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'}
                    alt="User avatar"
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                  />
                  <div>
                    <p className="text-lg font-medium text-gray-800">{settings?.name || user.name}</p>
                    <p className="text-sm text-gray-500">@{user.email.split('@')[0]}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 flex items-center">
                  <Lock className="w-4 h-4 mr-2 text-gray-400" />
                  Email: {settings?.email || user.email}
                </p>
                <p className="text-sm text-gray-600">Phone: {settings?.phone || 'Not set'}</p>
                <p className="text-sm text-gray-600">Address: {settings?.address || 'Not set'}</p>
                <p className="text-sm text-gray-600">Website: {profile?.website ? <a href={profile.website} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">{profile.website}</a> : 'Not set'}</p>
                <div className="mt-4">
                  <button
                    onClick={() => setIsSocialLinksOpen(!isSocialLinksOpen)}
                    className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                    aria-expanded={isSocialLinksOpen}
                    aria-controls="social-links"
                  >
                    {isSocialLinksOpen ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
                    Social Links
                  </button>
                  <AnimatePresence>
                    {isSocialLinksOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        id="social-links"
                        className="mt-2 space-y-2"
                      >
                        <p className="text-sm text-gray-600">
                          Twitter: {profile?.socialLinks?.twitter ? <a href={profile.socialLinks.twitter} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">{profile.socialLinks.twitter}</a> : 'Not set'}
                        </p>
                        <p className="text-sm text-gray-600">
                          LinkedIn: {profile?.socialLinks?.linkedin ? <a href={profile.socialLinks.linkedin} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">{profile.socialLinks.linkedin}</a> : 'Not set'}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Bio Section */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">About Me</h3>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{profile?.bio || 'No bio provided.'}</p>
              </div>

              {/* Preferences */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Preferences</h3>
                <p className="text-sm text-gray-600">Language: {settings?.language === 'en' ? 'English' : 'Kinyarwanda'}</p>
                <p className="text-sm text-gray-600">Timezone: {settings?.timezone || 'Africa/Kigali'}</p>
                <p className="text-sm text-gray-600">Preferred Currency: {settings?.preferredCurrency || 'RWF'}</p>
                <p className="text-sm text-gray-600">
                  Notifications:
                  {settings?.notificationPreferences
                    ? ` Email: ${settings.notificationPreferences.email ? 'On' : 'Off'}, Push: ${settings.notificationPreferences.push ? 'On' : 'Off'}, SMS: ${settings.notificationPreferences.sms ? 'On' : 'Off'}`
                    : 'Not set'}
                </p>
              </div>

              {/* Account Info */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h3>
                <p className="text-sm text-gray-600 flex items-center">
                  <Lock className="w-4 h-4 mr-2 text-gray-400" />
                  User ID: {user.id}
                </p>
                <p className="text-sm text-gray-600 flex items-center">
                  <Lock className="w-4 h-4 mr-2 text-gray-400" />
                  Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </p>
                <p className="text-sm text-gray-600 flex items-center">
                  <Lock className="w-4 h-4 mr-2 text-gray-400" />
                  Joined: {profile?.joinedDate ? new Date(profile.joinedDate).toLocaleDateString() : 'Unknown'}
                </p>
                <Link
                  to="/forgot-password"
                  className="mt-4 inline-flex items-center px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  aria-label="Change password"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Change Password
                </Link>
              </div>
            </div>
          ) : (
            /* Edit Mode */
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {/* Personal Info */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      id="name"
                      {...register('name', { required: 'Name is required' })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                      aria-invalid={errors.name ? 'true' : 'false'}
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <input
                      id="phone"
                      {...register('phone', { pattern: { value: /^\+?[1-9]\d{1,14}$/, message: 'Invalid phone number' } })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                      aria-invalid={errors.phone ? 'true' : 'false'}
                    />
                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <input
                      id="address"
                      {...register('address')}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
                      Avatar URL
                    </label>
                    <input
                      id="avatar"
                      {...register('avatar', { pattern: { value: /^https?:\/\/.+$/, message: 'Invalid URL' } })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                      aria-invalid={errors.avatar ? 'true' : 'false'}
                    />
                    {errors.avatar && <p className="mt-1 text-sm text-red-600">{errors.avatar.message}</p>}
                    {avatarUrl && (
                      <img
                        src={avatarUrl}
                        alt="Avatar preview"
                        className="mt-2 w-16 h-16 rounded-full object-cover"
                        onError={(e) => (e.currentTarget.src = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg')}
                      />
                    )}
                  </div>
                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                      Website
                    </label>
                    <input
                      id="website"
                      {...register('website', { pattern: { value: /^https?:\/\/.+$/, message: 'Invalid URL' } })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                      aria-invalid={errors.website ? 'true' : 'false'}
                    />
                    {errors.website && <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>}
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => setIsSocialLinksOpen(!isSocialLinksOpen)}
                    className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                    aria-expanded={isSocialLinksOpen}
                    aria-controls="social-links-edit"
                  >
                    {isSocialLinksOpen ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
                    Social Links
                  </button>
                  <AnimatePresence>
                    {isSocialLinksOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        id="social-links-edit"
                        className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        <div>
                          <label htmlFor="socialLinks.twitter" className="block text-sm font-medium text-gray-700">
                            Twitter
                          </label>
                          <input
                            id="socialLinks.twitter"
                            {...register('socialLinks.twitter', { pattern: { value: /^https?:\/\/(www\.)?twitter\.com\/.+$/, message: 'Invalid Twitter URL' } })}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                            aria-invalid={errors.socialLinks?.twitter ? 'true' : 'false'}
                          />
                          {errors.socialLinks?.twitter && <p className="mt-1 text-sm text-red-600">{errors.socialLinks.twitter.message}</p>}
                        </div>
                        <div>
                          <label htmlFor="socialLinks.linkedin" className="block text-sm font-medium text-gray-700">
                            LinkedIn
                          </label>
                          <input
                            id="socialLinks.linkedin"
                            {...register('socialLinks.linkedin', { pattern: { value: /^https?:\/\/(www\.)?linkedin\.com\/.+$/, message: 'Invalid LinkedIn URL' } })}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                            aria-invalid={errors.socialLinks?.linkedin ? 'true' : 'false'}
                          />
                          {errors.socialLinks?.linkedin && <p className="mt-1 text-sm text-red-600">{errors.socialLinks.linkedin.message}</p>}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Bio Section */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">About Me</h3>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                  Bio (up to 2000 characters)
                </label>
                <textarea
                  id="bio"
                  {...register('bio', { maxLength: { value: 2000, message: 'Bio must be 2000 characters or less' } })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                  rows={6}
                  aria-invalid={errors.bio ? 'true' : 'false'}
                />
                {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>}
              </div>

              {/* Preferences */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                      Language
                    </label>
                    <select
                      id="language"
                      {...register('language', { required: 'Language is required' })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                      aria-invalid={errors.language ? 'true' : 'false'}
                    >
                      <option value="en">English</option>
                      <option value="rw">Kinyarwanda</option>
                    </select>
                    {errors.language && <p className="mt-1 text-sm text-red-600">{errors.language.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                      Timezone
                    </label>
                    <select
                      id="timezone"
                      {...register('timezone', { required: 'Timezone is required' })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                      aria-invalid={errors.timezone ? 'true' : 'false'}
                    >
                      <option value="Africa/Kigali">Africa/Kigali</option>
                      <option value="UTC">UTC</option>
                    </select>
                    {errors.timezone && <p className="mt-1 text-sm text-red-600">{errors.timezone.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="preferredCurrency" className="block text-sm font-medium text-gray-700">
                      Preferred Currency
                    </label>
                    <select
                      id="preferredCurrency"
                      {...register('preferredCurrency', { required: 'Currency is required' })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                      aria-invalid={errors.preferredCurrency ? 'true' : 'false'}
                    >
                      <option value="RWF">RWF (Rwandan Franc)</option>
                      <option value="USD">USD</option>
                    </select>
                    {errors.preferredCurrency && <p className="mt-1 text-sm text-red-600">{errors.preferredCurrency.message}</p>}
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Notification Preferences</h4>
                  <div className="space-y-2">
                    <label className="flex items-center text-sm text-gray-600">
                      <input
                        type="checkbox"
                        {...register('notificationPreferences.email')}
                        className="mr-2 rounded text-blue-600 focus:ring-blue-500"
                      />
                      Email Notifications
                    </label>
                    <label className="flex items-center text-sm text-gray-600">
                      <input
                        type="checkbox"
                        {...register('notificationPreferences.push')}
                        className="mr-2 rounded text-blue-600 focus:ring-blue-500"
                      />
                      Push Notifications
                    </label>
                    <label className="flex items-center text-sm text-gray-600">
                      <input
                        type="checkbox"
                        {...register('notificationPreferences.sms')}
                        className="mr-2 rounded text-blue-600 focus:ring-blue-500"
                      />
                      SMS Notifications
                    </label>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  disabled={mutation.isPending}
                  aria-label="Save profile"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {mutation.isPending ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
                  aria-label="Cancel editing"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>
              </div>
            </motion.form>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default Profile;