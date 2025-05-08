import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { PencilIcon, SendIcon, EyeIcon, RefreshCwIcon, DownloadIcon, ChevronDownIcon, ToggleOnIcon, ToggleOffIcon, SettingsIcon } from 'lucide-react';
import axios from 'axios';
interface AdminSettings {
  profile: {
    fullName: string;
    email: string;
    phone: string;
    password?: string;
    confirmPassword?: string;
    lastUpdated: string;
  };
  notifications: {
    email: {
      newOrders: boolean;
      paymentIssues: boolean;
      dispatchDelays: boolean;
      lowStock: boolean;
    };
    sms: {
      urgentDelays: boolean;
      criticalStock: boolean;
    };
    frequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
    recipients: string;
  };
  ui: {
    language: 'en' | 'rw';
    theme: 'light' | 'dark';
    tableRows: 10 | 25 | 50 | 100;
    dateFormat: 'DD/MM/YYYY' | 'YYYY-MM-DD' | 'MM/DD/YYYY';
    currency: 'RWF' | 'USD';
    fontSize: 'small' | 'medium' | 'large';
  };
  system: {
    order: {
      defaultStatus: 'pending' | 'shipped';
      autoGenerateId: boolean;
      expiryDays: number;
    };
    payment: {
      autoVerifyCOD: boolean;
      reminderDays: number;
    };
    inventory: {
      defaultReorderLevel: number;
      lowStockThreshold: number;
    };
    export: {
      defaultFields: string[];
      includeTimestamps: boolean;
      format: 'csv' | 'json';
    };
  };
  advanced: {
    integrations: {
      googleDriveApiKey: string;
      googleSheetsSync: boolean;
      smtp: {
        host: string;
        port: number;
        username: string;
        password: string;
      };
    };
    backup: {
      autoFrequency: 'daily' | 'weekly' | 'monthly';
      lastBackup: string;
    };
    roles: {
      preview: 'admin' | 'sales' | 'manager';
      permissions: string[];
    };
  };
}
const Settings: React.FC = () => {
  const {
    t
  } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: {
      errors
    },
    reset,
    watch
  } = useForm<AdminSettings>({
    defaultValues: {
      profile: {
        fullName: 'Admin John',
        email: 'admin@mountmeru.rw',
        phone: '+250788123456',
        lastUpdated: new Date().toISOString()
      },
      notifications: {
        email: {
          newOrders: true,
          paymentIssues: false,
          dispatchDelays: true,
          lowStock: true
        },
        sms: {
          urgentDelays: false,
          criticalStock: false
        },
        frequency: 'daily',
        recipients: ''
      },
      ui: {
        language: 'en',
        theme: 'light',
        tableRows: 25,
        dateFormat: 'DD/MM/YYYY',
        currency: 'RWF',
        fontSize: 'medium'
      },
      system: {
        order: {
          defaultStatus: 'pending',
          autoGenerateId: true,
          expiryDays: 7
        },
        payment: {
          autoVerifyCOD: false,
          reminderDays: 2
        },
        inventory: {
          defaultReorderLevel: 50,
          lowStockThreshold: 10
        },
        export: {
          defaultFields: ['OrderID', 'ClientName', 'Amount', 'Status'],
          includeTimestamps: true,
          format: 'csv'
        }
      },
      advanced: {
        integrations: {
          googleDriveApiKey: '',
          googleSheetsSync: false,
          smtp: {
            host: '',
            port: 0,
            username: '',
            password: ''
          }
        },
        backup: {
          autoFrequency: 'weekly',
          lastBackup: ''
        },
        roles: {
          preview: 'admin',
          permissions: ['view_all', 'edit_orders']
        }
      }
    }
  });
  const [isEditingProfile, setIsEditingProfile] = React.useState(false);
  const [isNotificationLogOpen, setIsNotificationLogOpen] = React.useState(false);
  const [isAuditLogOpen, setIsAuditLogOpen] = React.useState(false);
  const [isBackupHistoryOpen, setIsBackupHistoryOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const onSubmit: SubmitHandler<AdminSettings> = async data => {
    setIsLoading(true);
    try {
      // Mocked API calls
      await axios.post('/api/admin/profile', data.profile);
      await axios.post('/api/admin/notifications', data.notifications);
      await axios.post('/api/admin/ui', data.ui);
      await axios.post('/api/admin/system', data.system);
      await axios.post('/api/admin/advanced', data.advanced);
      toast.success(t('settings.save_success'), {
        theme: 'light'
      });
      setIsEditingProfile(false);
    } catch (error) {
      toast.error(t('settings.save_error'), {
        theme: 'light'
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleTestNotification = () => {
    toast.info(t('settings.test_notification'), {
      theme: 'light'
    });
  };
  const handlePreviewTheme = () => {
    // Mocked theme preview
    toast.info(t('settings.theme_preview'), {
      theme: 'light'
    });
  };
  const handleResetDefaults = () => {
    reset();
    toast.success(t('settings.reset_success'), {
      theme: 'light'
    });
  };
  const handleBackup = () => {
    setIsLoading(true);
    // Mocked backup
    setTimeout(() => {
      toast.success(t('settings.backup_success'), {
        theme: 'light'
      });
      setIsLoading(false);
    }, 1000);
  };
  const handleTestIntegration = () => {
    toast.info(t('settings.integration_test'), {
      theme: 'light'
    });
  };
  return <div className="max-w-4xl mx-auto p-8 bg-white shadow-md border border-black/10 space-y-8">
      <h1 className="text-2xl font-bold text-black">{t('settings.title')}</h1>

      {/* Admin Profile */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-black">{t('settings.profile')}</h2>
          <button onClick={() => setIsEditingProfile(!isEditingProfile)} className="p-2 rounded-md text-black hover:bg-black/10" aria-label={t('settings.edit_profile')}>
            <PencilIcon size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base text-black">{t('settings.full_name')}</label>
              <input {...register('profile.fullName', {
              required: true,
              minLength: 2
            })} disabled={!isEditingProfile} className="w-full border border-black rounded-md p-2 text-black disabled:bg-gray-100 focus:ring-black focus:border-black" aria-invalid={errors.profile?.fullName ? 'true' : 'false'} />
              {errors.profile?.fullName && <p className="text-sm text-red-500">{t('settings.full_name_error')}</p>}
            </div>
            <div>
              <label className="block text-base text-black">{t('settings.email')}</label>
              <input {...register('profile.email', {
              required: true,
              pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            })} disabled={!isEditingProfile} className="w-full border border-black rounded-md p-2 text-black disabled:bg-gray-100 focus:ring-black focus:border-black" aria-invalid={errors.profile?.email ? 'true' : 'false'} />
              {errors.profile?.email && <p className="text-sm text-red-500">{t('settings.email_error')}</p>}
            </div>
            <div>
              <label className="block text-base text-black">{t('settings.phone')}</label>
              <input {...register('profile.phone', {
              required: true,
              pattern: /^\+2507[0-9]{8}$/
            })} disabled={!isEditingProfile} className="w-full border border-black rounded-md p-2 text-black disabled:bg-gray-100 focus:ring-black focus:border-black" aria-invalid={errors.profile?.phone ? 'true' : 'false'} />
              {errors.profile?.phone && <p className="text-sm text-red-500">{t('settings.phone_error')}</p>}
            </div>
            {isEditingProfile && <>
                <div>
                  <label className="block text-base text-black">{t('settings.password')}</label>
                  <input type="password" {...register('profile.password', {
                minLength: 8
              })} className="w-full border border-black rounded-md p-2 text-black focus:ring-black focus:border-black" aria-invalid={errors.profile?.password ? 'true' : 'false'} />
                  {errors.profile?.password && <p className="text-sm text-red-500">{t('settings.password_error')}</p>}
                </div>
                <div>
                  <label className="block text-base text-black">{t('settings.confirm_password')}</label>
                  <input type="password" {...register('profile.confirmPassword', {
                validate: value => value === watch('profile.password') || t('settings.password_match_error')
              })} className="w-full border border-black rounded-md p-2 text-black focus:ring-black focus:border-black" aria-invalid={errors.profile?.confirmPassword ? 'true' : 'false'} />
                  {errors.profile?.confirmPassword && <p className="text-sm text-red-500">{errors.profile.confirmPassword.message}</p>}
                </div>
              </>}
          </div>
          <div className="text-sm text-gray-600">{t('settings.last_updated')}: {watch('profile.lastUpdated')}</div>
          {isEditingProfile && <button type="submit" disabled={isLoading} className="flex items-center bg-black text-white rounded-md px-6 py-3 hover:bg-black/80 disabled:opacity-50">
              {isLoading && <Spinner />}
              {t('settings.save')}
            </button>}
        </form>
      </section>

      {/* Notification Preferences */}
      <section className="space-y-4 border-t border-black/10 pt-6">
        <h2 className="text-lg font-bold text-black">{t('settings.notifications')}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center space-x-2">
                <input type="checkbox" {...register('notifications.email.newOrders')} className="border-black focus:ring-black" />
                <span className="text-base text-black">{t('settings.email_new_orders')}</span>
              </label>
              <label className="flex items-center space-x-2 mt-2">
                <input type="checkbox" {...register('notifications.email.paymentIssues')} className="border-black focus:ring-black" />
                <span className="text-base text-black">{t('settings.email_payment_issues')}</span>
              </label>
              <label className="flex items-center space-x-2 mt-2">
                <input type="checkbox" {...register('notifications.email.dispatchDelays')} className="border-black focus:ring-black" />
                <span className="text-base text-black">{t('settings.email_dispatch_delays')}</span>
              </label>
              <label className="flex items-center space-x-2 mt-2">
                <input type="checkbox" {...register('notifications.email.lowStock')} className="border-black focus:ring-black" />
                <span className="text-base text-black">{t('settings.email_low_stock')}</span>
              </label>
            </div>
            <div>
              <label className="flex items-center space-x-2">
                <input type="checkbox" {...register('notifications.sms.urgentDelays')} className="border-black focus:ring-black" />
                <span className="text-base text-black">{t('settings.sms_urgent_delays')}</span>
              </label>
              <label className="flex items-center space-x-2 mt-2">
                <input type="checkbox" {...register('notifications.sms.criticalStock')} className="border-black focus:ring-black" />
                <span className="text-base text-black">{t('settings.sms_critical_stock')}</span>
              </label>
              <div className="mt-4">
                <label className="block text-base text-black">{t('settings.alert_frequency')}</label>
                <select {...register('notifications.frequency')} className="w-full border border-black rounded-md p-2 text-black focus:ring-black focus:border-black">
                  <option value="realtime">{t('settings.frequency_realtime')}</option>
                  <option value="hourly">{t('settings.frequency_hourly')}</option>
                  <option value="daily">{t('settings.frequency_daily')}</option>
                  <option value="weekly">{t('settings.frequency_weekly')}</option>
                </select>
              </div>
              <div className="mt-4">
                <label className="block text-base text-black">{t('settings.additional_recipients')}</label>
                <input {...register('notifications.recipients', {
                pattern: /^([^\s@]+@[^\s@]+\.[^\s@]+,)*[^\s@]+@[^\s@]+\.[^\s@]+$/
              })} className="w-full border border-black rounded-md p-2 text-black focus:ring-black focus:border-black" aria-invalid={errors.notifications?.recipients ? 'true' : 'false'} />
                {errors.notifications?.recipients && <p className="text-sm text-red-500">{t('settings.recipients_error')}</p>}
              </div>
            </div>
          </div>
          <div className="flex space-x-4">
            <button type="submit" disabled={isLoading} className="flex items-center bg-black text-white rounded-md px-6 py-3 hover:bg-black/80 disabled:opacity-50">
              {isLoading && <Spinner />}
              {t('settings.save')}
            </button>
            <button type="button" onClick={handleTestNotification} className="flex items-center bg-black text-white rounded-md px-6 py-3 hover:bg-black/80">
              <SendIcon size={20} className="mr-2" />
              {t('settings.test_notification')}
            </button>
          </div>
          <div>
            <button onClick={() => setIsNotificationLogOpen(!isNotificationLogOpen)} className="flex items-center text-black hover:underline">
              <ChevronDownIcon size={20} className={`mr-2 transform ${isNotificationLogOpen ? 'rotate-180' : ''}`} />
              {t('settings.notification_log')}
            </button>
            {isNotificationLogOpen && <table className="w-full mt-2 border border-black/10">
                <thead>
                  <tr className="bg-white">
                    <th className="p-2 text-left text-black">{t('settings.log_date')}</th>
                    <th className="p-2 text-left text-black">{t('settings.log_type')}</th>
                    <th className="p-2 text-left text-black">{t('settings.log_message')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 text-black">2025-04-20 08:00</td>
                    <td className="p-2 text-black">{t('settings.email_low_stock')}</td>
                    <td className="p-2 text-black">1L Oil: 45 units</td>
                  </tr>
                  {/* Mocked data */}
                </tbody>
              </table>}
          </div>
        </form>
      </section>

      {/* UI Preferences */}
      <section className="space-y-4 border-t border-black/10 pt-6">
        <h2 className="text-lg font-bold text-black">{t('settings.ui_preferences')}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base text-black">{t('settings.language')}</label>
              <select {...register('ui.language')} className="w-full border border-black rounded-md p-2 text-black focus:ring-black focus:border-black">
                <option value="en">{t('settings.language_en')}</option>
                <option value="rw">{t('settings.language_rw')}</option>
              </select>
            </div>
            <div>
              <label className="block text-base text-black">{t('settings.theme')}</label>
              <select {...register('ui.theme')} className="w-full border border-black rounded-md p-2 text-black focus:ring-black focus:border-black">
                <option value="light">{t('settings.theme_light')}</option>
                <option value="dark">{t('settings.theme_dark')}</option>
              </select>
            </div>
            <div>
              <label className="block text-base text-black">{t('settings.table_rows')}</label>
              <select {...register('ui.tableRows')} className="w-full border border-black rounded-md p-2 text-black focus:ring-black focus:border-black">
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            <div>
              <label className="block text-base text-black">{t('settings.date_format')}</label>
              <select {...register('ui.dateFormat')} className="w-full border border-black rounded-md p-2 text-black focus:ring-black focus:border-black">
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              </select>
            </div>
            <div>
              <label className="block text-base text-black">{t('settings.currency')}</label>
              <select {...register('ui.currency')} className="w-full border border-black rounded-md p-2 text-black focus:ring-black focus:border-black">
                <option value="RWF">RWF</option>
                <option value="USD">USD</option>
              </select>
            </div>
            <div>
              <label className="block text-base text-black">{t('settings.font_size')}</label>
              <select {...register('ui.fontSize')} className="w-full border border-black rounded-md p-2 text-black focus:ring-black focus:border-black">
                <option value="small">{t('settings.font_small')}</option>
                <option value="medium">{t('settings.font_medium')}</option>
                <option value="large">{t('settings.font_large')}</option>
              </select>
            </div>
          </div>
          <div className="flex space-x-4">
            <button type="submit" disabled={isLoading} className="flex items-center bg-black text-white rounded-md px-6 py-3 hover:bg-black/80 disabled:opacity-50">
              {isLoading && <Spinner />}
              {t('settings.save')}
            </button>
            <button type="button" onClick={handlePreviewTheme} className="flex items-center bg-black text-white rounded-md px-6 py-3 hover:bg-black/80">
              <EyeIcon size={20} className="mr-2" />
              {t('settings.preview_theme')}
            </button>
            <button type="button" onClick={handleResetDefaults} className="flex items-center bg-black text-white rounded-md px-6 py-3 hover:bg-black/80">
              <RefreshCwIcon size={20} className="mr-2" />
              {t('settings.reset')}
            </button>
          </div>
        </form>
      </section>

      {/* System Settings */}
      <section className="space-y-4 border-t border-black/10 pt-6">
        <h2 className="text-lg font-bold text-black">{t('settings.system_settings')}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-black">{t('settings.order_processing')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-base text-black">{t('settings.default_order_status')}</label>
                <select {...register('system.order.defaultStatus')} className="w-full border border-black rounded-md p-2 text-black focus:ring-black focus:border-black">
                  <option value="pending">{t('settings.status_pending')}</option>
                  <option value="shipped">{t('settings.status_shipped')}</option>
                </select>
              </div>
              <div>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" {...register('system.order.autoGenerateId')} className="border-black focus:ring-black" />
                  <span className="text-base text-black">{t('settings.auto_generate_id')}</span>
                </label>
              </div>
              <div>
                <label className="block text-base text-black">{t('settings.order_expiry')}</label>
                <input type="number" {...register('system.order.expiryDays', {
                required: true,
                min: 0
              })} className="w-full border border-black rounded-md p-2 text-black focus:ring-black focus:border-black" aria-invalid={errors.system?.order?.expiryDays ? 'true' : 'false'} />
                {errors.system?.order?.expiryDays && <p className="text-sm text-red-500">{t('settings.expiry_error')}</p>}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-base font-bold text-black">{t('settings.payment_verification')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" {...register('system.payment.autoVerifyCOD')} className="border-black focus:ring-black" />
                  <span className="text-base text-black">{t('settings.auto_verify_cod')}</span>
                </label>
              </div>
              <div>
                <label className="block text-base text-black">{t('settings.payment_reminder')}</label>
                <input type="number" {...register('system.payment.reminderDays', {
                required: true,
                min: 0
              })} className="w-full border border-black rounded-md p-2 text-black focus:ring-black focus:border-black" aria-invalid={errors.system?.payment?.reminderDays ? 'true' : 'false'} />
                {errors.system?.payment?.reminderDays && <p className="text-sm text-red-500">{t('settings.reminder_error')}</p>}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-base font-bold text-black">{t('settings.inventory_management')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-base text-black">{t('settings.reorder_level')}</label>
                <input type="number" {...register('system.inventory.defaultReorderLevel', {
                required: true,
                min: 0
              })} className="w-full border border-black rounded-md p-2 text-black focus:ring-black focus:border-black" aria-invalid={errors.system?.inventory?.defaultReorderLevel ? 'true' : 'false'} />
                {errors.system?.inventory?.defaultReorderLevel && <p className="text-sm text-red-500">{t('settings.reorder_error')}</p>}
              </div>
              <div>
                <label className="block text-base text-black">{t('settings.low_stock_threshold')}</label>
                <input type="number" {...register('system.inventory.lowStockThreshold', {
                required: true,
                min: 0
              })} className="w-full border border-black rounded-md p-2 text-black focus:ring-black focus:border-black" aria-invalid={errors.system?.inventory?.lowStockThreshold ? 'true' : 'false'} />
                {errors.system?.inventory?.lowStockThreshold && <p className="text-sm text-red-500">{t('settings.threshold_error')}</p>}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-base font-bold text-black">{t('settings.export_preferences')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-base text-black">{t('settings.default_fields')}</label>
                <div className="space-y-2">
                  {['OrderID', 'ClientName', 'Amount', 'Status', 'Notes'].map(field => <label key={field} className="flex items-center space-x-2">
                      <input type="checkbox" {...register(`system.export.defaultFields`)} value={field} className="border-black focus:ring-black" />
                      <span className="text-base text-black">{field}</span>
                    </label>)}
                </div>
              </div>
              <div>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" {...register('system.export.includeTimestamps')} className="border-black focus:ring-black" />
                  <span className="text-base text-black">{t('settings.include_timestamps')}</span>
                </label>
                <div className="mt-4">
                  <label className="block text-base text-black">{t('settings.export_format')}</label>
                  <select {...register('system.export.format')} className="w-full border border-black rounded-md p-2 text-black focus:ring-black focus:border-black">
                    <option value="csv">CSV</option>
                    <option value="json">JSON</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="flex space-x-4">
            <button type="submit" disabled={isLoading} className="flex items-center bg-black text-white rounded-md px-6 py-3 hover:bg-black/80 disabled:opacity-50">
              {isLoading && <Spinner />}
              {t('settings.save')}
            </button>
            <button type="button" onClick={handleResetDefaults} className="flex items-center bg-black text-white rounded-md px-6 py-3 hover:bg-black/80">
              <RefreshCwIcon size={20} className="mr-2" />
              {t('settings.reset')}
            </button>
          </div>
          <div>
            <button onClick={() => setIsAuditLogOpen(!isAuditLogOpen)} className="flex items-center text-black hover:underline">
              <ChevronDownIcon size={20} className={`mr-2 transform ${isAuditLogOpen ? 'rotate-180' : ''}`} />
              {t('settings.audit_log')}
            </button>
            {isAuditLogOpen && <table className="w-full mt-2 border border-black/10">
                <thead>
                  <tr className="bg-white">
                    <th className="p-2 text-left text-black">{t('settings.log_date')}</th>
                    <th className="p-2 text-left text-black">{t('settings.log_setting')}</th>
                    <th className="p-2 text-left text-black">{t('settings.log_value')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 text-black">2025-04-21 09:00</td>
                    <td className="p-2 text-black">{t('settings.reorder_level')}</td>
                    <td className="p-2 text-black">50</td>
                  </tr>
                  {/* Mocked data */}
                </tbody>
              </table>}
          </div>
        </form>
      </section>

      {/* Advanced Settings */}
      <section className="space-y-4 border-t border-black/10 pt-6">
        <h2 className="text-lg font-bold text-black">{t('settings.advanced_settings')}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-black">{t('settings.integrations')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-base text-black">{t('settings.google_drive_api')}</label>
                <input type="password" {...register('advanced.integrations.googleDriveApiKey')} className="w-full border border-black rounded-md p-2 text-black focus:ring-black focus:border-black" />
              </div>
              <div>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" {...register('advanced.integrations.googleSheetsSync')} className="border-black focus:ring-black" />
                  <span className="text-base text-black">{t('settings.google_sheets_sync')}</span>
                </label>
              </div>
              <div>
                <label className="block text-base text-black">{t('settings.smtp_host')}</label>
                <input {...register('advanced.integrations.smtp.host')} className="w-full border border-black rounded-md p-2 text-black focus:ring-black focus:border-black" />
              </div>
              <div>
                <label className="block text-base text-black">{t('settings.smtp_port')}</label>
                <input type="number" {...register('advanced.integrations.smtp.port')} className="w-full border border-black rounded-md p-2 text-black focus:ring-black focus:border-black" />
              </div>
              <div>
                <label className="block text-base text-black">{t('settings.smtp_username')}</label>
                <input {...register('advanced.integrations.smtp.username')} className="w-full border border-black rounded-md p-2 text-black focus:ring-black focus:border-black" />
              </div>
              <div>
                <label className="block text-base text-black">{t('settings.smtp_password')}</label>
                <input type="password" {...register('advanced.integrations.smtp.password')} className="w-full border border-black rounded-md p-2 text-black focus:ring-black focus:border-black" />
              </div>
            </div>
            <button type="button" onClick={handleTestIntegration} className="flex items-center bg-black text-white rounded-md px-6 py-3 hover:bg-black/80">
              <SendIcon size={20} className="mr-2" />
              {t('settings.test_integration')}
            </button>
          </div>
          <div className="space-y-4">
            <h3 className="text-base font-bold text-black">{t('settings.backup_settings')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-base text-black">{t('settings.auto_backup_frequency')}</label>
                <select {...register('advanced.backup.autoFrequency')} className="w-full border border-black rounded-md p-2 text-black focus:ring-black focus:border-black">
                  <option value="daily">{t('settings.backup_daily')}</option>
                  <option value="weekly">{t('settings.backup_weekly')}</option>
                  <option value="monthly">{t('settings.backup_monthly')}</option>
                </select>
              </div>
              <div>
                <label className="block text-base text-black">{t('settings.restore_backup')}</label>
                <input type="file" accept=".json" className="w-full border border-black rounded-md p-2 text-black" />
              </div>
            </div>
            <button type="button" onClick={handleBackup} disabled={isLoading} className="flex items-center bg-black text-white rounded-md px-6 py-3 hover:bg-black/80 disabled:opacity-50">
              {isLoading && <Spinner />}
              <DownloadIcon size={20} className="mr-2" />
              {t('settings.manual_backup')}
            </button>
            <div>
              <button onClick={() => setIsBackupHistoryOpen(!isBackupHistoryOpen)} className="flex items-center text-black hover:underline">
                <ChevronDownIcon size={20} className={`mr-2 transform ${isBackupHistoryOpen ? 'rotate-180' : ''}`} />
                {t('settings.backup_history')}
              </button>
              {isBackupHistoryOpen && <table className="w-full mt-2 border border-black/10">
                  <thead>
                    <tr className="bg-white">
                      <th className="p-2 text-left text-black">{t('settings.log_date')}</th>
                      <th className="p-2 text-left text-black">{t('settings.log_file')}</th>
                      <th className="p-2 text-left text-black">{t('settings.log_size')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 text-black">2025-04-20 10:00</td>
                      <td className="p-2 text-black">settings_20250420.json</td>
                      <td className="p-2 text-black">1.2 KB</td>
                    </tr>
                    {/* Mocked data */}
                  </tbody>
                </table>}
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-base font-bold text-black">{t('settings.role_access')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-base text-black">{t('settings.preview_role')}</label>
                <select {...register('advanced.roles.preview')} className="w-full border border-black rounded-md p-2 text-black focus:ring-black focus:border-black">
                  <option value="admin">{t('settings.role_admin')}</option>
                  <option value="sales">{t('settings.role_sales')}</option>
                  <option value="manager">{t('settings.role_manager')}</option>
                </select>
              </div>
              <div>
                <label className="block text-base text-black">{t('settings.default_permissions')}</label>
                <div className="space-y-2">
                  {['view_all', 'edit_orders', 'view_analytics'].map(perm => <label key={perm} className="flex items-center space-x-2">
                      <input type="checkbox" {...register(`advanced.roles.permissions`)} value={perm} className="border-black focus:ring-black" />
                      <span className="text-base text-black">{perm}</span>
                    </label>)}
                </div>
              </div>
            </div>
          </div>
          <button type="submit" disabled={isLoading} className="flex items-center bg-black text-white rounded-md px-6 py-3 hover:bg-black/80 disabled:opacity-50">
            {isLoading && <Spinner />}
            {t('settings.save')}
          </button>
        </form>
      </section>
    </div>;
};

// Mocked Spinner component
const Spinner: React.FC = () => <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24" aria-label="Loading">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>;
export default Settings;