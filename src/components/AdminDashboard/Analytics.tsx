import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { BarChartIcon, DownloadIcon, RefreshCwIcon, ChevronDownIcon, ShoppingBagIcon, UserIcon, StarIcon, DollarSignIcon, TrendingUpIcon, PackageIcon } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

// Mock customer data from Customers.tsx
const customers = [{
  id: 'CUST-001',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+250788123456',
  address: 'KG 123 St, Kigali',
  totalOrders: 15,
  totalSpent: '375000',
  lastOrderDate: '2025-04-21',
  segment: 'VIP',
  language: 'English',
  joinDate: '2024-01-15',
  status: 'Active',
  notes: 'Prefers delivery in the morning'
}, {
  id: 'CUST-002',
  name: 'Jane Smith',
  email: 'jane@example.com',
  phone: '+250788234567',
  address: 'KN 45 Rd, Kigali',
  totalOrders: 8,
  totalSpent: '180000',
  lastOrderDate: '2025-04-20',
  segment: 'Regular',
  language: 'Kinyarwanda',
  joinDate: '2024-02-10',
  status: 'Active',
  notes: ''
}, {
  id: 'CUST-003',
  name: 'Robert Johnson',
  email: 'robert@example.com',
  phone: '+250788345678',
  address: 'KK 15 Ave, Kigali',
  totalOrders: 3,
  totalSpent: '45000',
  lastOrderDate: '2025-04-18',
  segment: 'New',
  language: 'English',
  joinDate: '2025-03-01',
  status: 'Active',
  notes: 'Interested in bulk orders'
}, {
  id: 'CUST-004',
  name: 'Mary Williams',
  email: 'mary@example.com',
  phone: '+250788456789',
  address: 'KN 78 St, Kigali',
  totalOrders: 12,
  totalSpent: '280000',
  lastOrderDate: '2025-04-19',
  segment: 'VIP',
  language: 'Kinyarwanda',
  joinDate: '2024-01-20',
  status: 'Active',
  notes: ''
}, {
  id: 'CUST-005',
  name: 'David Brown',
  email: 'david@example.com',
  phone: '+250788567890',
  address: 'KG 56 Ave, Kigali',
  totalOrders: 1,
  totalSpent: '15000',
  lastOrderDate: '2025-04-15',
  segment: 'New',
  language: 'English',
  joinDate: '2025-04-15',
  status: 'Inactive',
  notes: 'First-time customer'
}];
interface Settings {
  analytics: {
    defaultMetrics: string[];
    chartType: 'bar' | 'line' | 'pie';
    refreshInterval: 'realtime' | 'hourly' | 'daily';
    exportFormat: 'csv' | 'json' | 'pdf';
  };
  ui: {
    currency: 'RWF' | 'USD';
  };
}
const Analytics: React.FC = () => {
  const {
    t
  } = useTranslation();
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('settings');
    return saved ? JSON.parse(saved) : {
      analytics: {
        defaultMetrics: ['totalOrders', 'totalSpent', 'newCustomers'],
        chartType: 'bar',
        refreshInterval: 'daily',
        exportFormat: 'csv'
      },
      ui: {
        currency: 'RWF'
      }
    };
  });
  const [isLoading, setIsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [chartData, setChartData] = useState<any[]>([]);
  const [segmentData, setSegmentData] = useState<any[]>([]);

  // Calculate metrics
  const totalOrders = customers.reduce((sum, c) => sum + c.totalOrders, 0);
  const totalSpent = customers.reduce((sum, c) => sum + parseFloat(c.totalSpent), 0);
  const vipCustomers = customers.filter(c => c.segment === 'VIP').length;
  const newCustomers = customers.filter(c => new Date(c.joinDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length;
  const averageOrderValue = totalOrders ? (totalSpent / totalOrders).toFixed(2) : '0.00';
  const retentionRate = (customers.filter(c => c.status === 'Active').length / customers.length * 100).toFixed(1);
  const inventoryTurnover = (totalOrders / customers.length).toFixed(2); // Simplified

  // Prepare chart data (orders over time)
  useEffect(() => {
    const endDate = new Date();
    let startDate = new Date();
    if (timeRange === '7d') startDate.setDate(endDate.getDate() - 7);else if (timeRange === '30d') startDate.setDate(endDate.getDate() - 30);else if (timeRange === '90d') startDate.setDate(endDate.getDate() - 90);else startDate = new Date('2024-01-01'); // All time

    const ordersByDate: {
      [key: string]: number;
    } = {};
    customers.forEach(c => {
      const orderDate = new Date(c.lastOrderDate);
      if (orderDate >= startDate && orderDate <= endDate) {
        const dateStr = orderDate.toISOString().split('T')[0];
        ordersByDate[dateStr] = (ordersByDate[dateStr] || 0) + c.totalOrders;
      }
    });
    const data = Object.entries(ordersByDate).map(([date, orders]) => ({
      date,
      orders
    }));
    setChartData(data);

    // Segment distribution
    const segments = ['VIP', 'Regular', 'New'].map(segment => ({
      name: segment,
      value: customers.filter(c => c.segment === segment).length
    }));
    setSegmentData(segments);
  }, [timeRange]);

  // Auto-refresh based on settings
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (settings.analytics.refreshInterval !== 'daily') {
      const ms = settings.analytics.refreshInterval === 'realtime' ? 60000 : 3600000; // 1min or 1hr
      interval = setInterval(() => {
        setChartData(prev => [...prev]); // Trigger re-render
        toast.info(t('analytics.refreshed'), {
          theme: 'light'
        });
      }, ms);
    }
    return () => clearInterval(interval);
  }, [settings.analytics.refreshInterval, t]);

  // Export data
  const handleExport = async () => {
    setIsLoading(true);
    try {
      const data = {
        totalOrders,
        totalSpent,
        vipCustomers,
        newCustomers,
        averageOrderValue,
        retentionRate,
        inventoryTurnover,
        chartData,
        segmentData
      };
      const format = settings.analytics.exportFormat;
      if (format === 'csv') {
        const csv = ['Metric,Value', `Total Orders,${totalOrders}`, `Total Spent,${totalSpent} ${settings.ui.currency}`, `VIP Customers,${vipCustomers}`, `New Customers,${newCustomers}`, `Average Order Value,${averageOrderValue} ${settings.ui.currency}`, `Retention Rate,${retentionRate}%`, `Inventory Turnover,${inventoryTurnover}`].join('\n');
        const blob = new Blob([csv], {
          type: 'text/csv'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-${new Date().toISOString()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      } else if (format === 'json') {
        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-${new Date().toISOString()}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        // PDF export (mocked)
        await axios.post('/api/export/pdf', data);
        toast.success(t('analytics.pdf_exported'), {
          theme: 'light'
        });
      }
      toast.success(t('analytics.export_success'), {
        theme: 'light'
      });
    } catch (error) {
      toast.error(t('analytics.export_error'), {
        theme: 'light'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Chart colors
  const COLORS = ['#6B7280', '#8B5CF6', '#10B981'];
  return <div className="max-w-7xl mx-auto p-6 bg-white shadow-md border border-black/10 space-y-6 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BarChartIcon size={24} className="text-black" />
          <h1 className="text-2xl font-bold text-black">{t('analytics.title')}</h1>
        </div>
        <div className="flex space-x-2">
          <select value={timeRange} onChange={e => setTimeRange(e.target.value as any)} className="border border-black/20 rounded-md px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black/50">
            <option value="7d">{t('analytics.7_days')}</option>
            <option value="30d">{t('analytics.30_days')}</option>
            <option value="90d">{t('analytics.90_days')}</option>
            <option value="all">{t('analytics.all_time')}</option>
          </select>
          <button onClick={handleExport} disabled={isLoading} className="flex items-center bg-black text-white rounded-md px-4 py-2 hover:bg-black/80 disabled:opacity-50">
            {isLoading ? <Spinner /> : <DownloadIcon size={16} className="mr-1" />}
            {t('analytics.export')}
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {settings.analytics.defaultMetrics.includes('totalOrders') && <MetricCard icon={<ShoppingBagIcon size={24} className="text-black/70" />} title={t('analytics.total_orders')} value={totalOrders.toString()} />}
        {settings.analytics.defaultMetrics.includes('totalSpent') && <MetricCard icon={<DollarSignIcon size={24} className="text-black/70" />} title={t('analytics.total_spent')} value={`${totalSpent.toLocaleString()} ${settings.ui.currency}`} />}
        {settings.analytics.defaultMetrics.includes('newCustomers') && <MetricCard icon={<UserIcon size={24} className="text-black/70" />} title={t('analytics.new_customers')} value={newCustomers.toString()} />}
        {settings.analytics.defaultMetrics.includes('vipCustomers') && <MetricCard icon={<StarIcon size={24} className="text-black/70" />} title={t('analytics.vip_customers')} value={vipCustomers.toString()} />}
        {settings.analytics.defaultMetrics.includes('averageOrderValue') && <MetricCard icon={<DollarSignIcon size={24} className="text-black/70" />} title={t('analytics.avg_order_value')} value={`${averageOrderValue} ${settings.ui.currency}`} />}
        {settings.analytics.defaultMetrics.includes('customerRetention') && <MetricCard icon={<TrendingUpIcon size={24} className="text-black/70" />} title={t('analytics.retention_rate')} value={`${retentionRate}%`} />}
        {settings.analytics.defaultMetrics.includes('inventoryTurnover') && <MetricCard icon={<PackageIcon size={24} className="text-black/70" />} title={t('analytics.inventory_turnover')} value={inventoryTurnover} />}
      </div>

      {/* Charts */}
      <div className="space-y-6">
        <div className="bg-white p-4 rounded-lg border border-black/10 shadow-sm">
          <h2 className="text-lg font-bold text-black mb-4">
            {t('analytics.orders_over_time')}
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {settings.analytics.chartType === 'bar' ? <BarChart data={chartData}>
                  <XAxis dataKey="date" stroke="#000000" />
                  <YAxis stroke="#000000" />
                  <Tooltip contentStyle={{
                backgroundColor: '#FFFFFF',
                borderColor: '#000000/10'
              }} labelStyle={{
                color: '#000000'
              }} />
                  <Legend />
                  <Bar dataKey="orders" fill="#6B7280" />
                </BarChart> : settings.analytics.chartType === 'line' ? <LineChart data={chartData}>
                  <XAxis dataKey="date" stroke="#000000" />
                  <YAxis stroke="#000000" />
                  <Tooltip contentStyle={{
                backgroundColor: '#FFFFFF',
                borderColor: '#000000/10'
              }} labelStyle={{
                color: '#000000'
              }} />
                  <Legend />
                  <Line type="monotone" dataKey="orders" stroke="#6B7280" />
                </LineChart> : <PieChart>
                  <Pie data={chartData} dataKey="orders" nameKey="date" cx="50%" cy="50%" outerRadius={100} label>
                    {chartData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{
                backgroundColor: '#FFFFFF',
                borderColor: '#000000/10'
              }} labelStyle={{
                color: '#000000'
              }} />
                  <Legend />
                </PieChart>}
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-black/10 shadow-sm">
          <h2 className="text-lg font-bold text-black mb-4">
            {t('analytics.segment_distribution')}
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={segmentData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {segmentData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{
                backgroundColor: '#FFFFFF',
                borderColor: '#000000/10'
              }} labelStyle={{
                color: '#000000'
              }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>;
};

// Metric Card Component
interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}
const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  title,
  value
}) => <div className="bg-black/5 p-4 rounded-lg">
    <div className="flex items-center justify-between">
      <div className="text-black/70">{icon}</div>
      <span className="text-2xl font-bold text-black">{value}</span>
    </div>
    <div className="mt-2 text-sm font-medium text-black/70">{title}</div>
  </div>;

// Spinner Component
const Spinner: React.FC = () => <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24" aria-label="Loading">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 0 7.938l3-2.647z" />
  </svg>;
export default Analytics;