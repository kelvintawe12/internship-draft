import React, { useState } from 'react';
import { ShoppingCartIcon, ClockIcon, TruckIcon, CheckCircleIcon, DollarSignIcon, UsersIcon, AlertCircleIcon, PackageIcon, PlusIcon, CreditCardIcon, FileTextIcon, DownloadIcon } from 'lucide-react';
import LineChart from '../Charts/LineChart';
const Overview = () => {
  const [chartView, setChartView] = useState('orders'); // 'orders', 'revenue', 'combined'
  const metricsData = [{
    id: 'total-orders',
    label: 'Total Orders',
    value: '1,234',
    icon: <ShoppingCartIcon size={24} />,
    color: 'bg-black/5'
  }, {
    id: 'pending-orders',
    label: 'Pending Orders',
    value: '45',
    icon: <ClockIcon size={24} />,
    color: 'bg-black/5'
  }, {
    id: 'shipped-orders',
    label: 'Shipped Orders',
    value: '320',
    icon: <TruckIcon size={24} />,
    color: 'bg-black/5'
  }, {
    id: 'delivered-orders',
    label: 'Delivered Orders',
    value: '869',
    icon: <CheckCircleIcon size={24} />,
    color: 'bg-black/5'
  }, {
    id: 'total-revenue',
    label: 'Total Revenue',
    value: '12,345,678 RWF',
    icon: <DollarSignIcon size={24} />,
    color: 'bg-black/5'
  }, {
    id: 'active-customers',
    label: 'Active Customers',
    value: '567',
    icon: <UsersIcon size={24} />,
    color: 'bg-black/5'
  }, {
    id: 'pending-payments',
    label: 'Pending Payments',
    value: '23',
    icon: <CreditCardIcon size={24} />,
    color: 'bg-black/5'
  }, {
    id: 'dispatch-delays',
    label: 'Dispatch Delays',
    value: '12',
    icon: <AlertCircleIcon size={24} />,
    color: 'bg-black/5'
  }, {
    id: 'low-stock',
    label: 'Low Stock Alerts',
    value: '2 products',
    icon: <PackageIcon size={24} />,
    color: 'bg-black/5'
  }];
  const quickActions = [{
    id: 'new-order',
    label: 'New Order',
    icon: <PlusIcon size={16} />
  }, {
    id: 'verify-payment',
    label: 'Verify Payment',
    icon: <CreditCardIcon size={16} />
  }, {
    id: 'view-low-stock',
    label: 'View Low Stock',
    icon: <PackageIcon size={16} />
  }, {
    id: 'export-overview',
    label: 'Export Overview',
    icon: <DownloadIcon size={16} />
  }];
  return <div className="space-y-6">
      {/* Alert Banner */}
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
        <div className="flex items-center">
          <AlertCircleIcon size={20} className="text-red-500 mr-2" />
          <p className="text-red-700 font-medium">
            5 orders delayed!{' '}
            <a href="#" className="underline">
              View dispatches
            </a>
          </p>
        </div>
      </div>
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {metricsData.map(metric => <div key={metric.id} className={`${metric.color} p-6 rounded-lg border border-black/10 shadow-sm`} aria-label={`${metric.label}: ${metric.value}`}>
            <div className="flex justify-between">
              <div className="text-black/70">{metric.icon}</div>
              <span className="text-2xl font-bold">{metric.value}</span>
            </div>
            <div className="mt-2 text-sm font-medium text-black/70">
              {metric.label}
            </div>
          </div>)}
      </div>
      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-medium mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-2">
          {quickActions.map(action => <button key={action.id} className="flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-black/80 transition-colors">
              <span className="mr-2">{action.icon}</span>
              {action.label}
            </button>)}
        </div>
      </div>
      {/* Chart Section */}
      <div className="bg-white p-6 rounded-lg border border-black/10 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-lg font-medium">
            Orders & Revenue (Last 30 Days)
          </h2>
          <div className="flex mt-2 sm:mt-0 space-x-2">
            <button className={`px-3 py-1 rounded-md text-sm ${chartView === 'orders' ? 'bg-black text-white' : 'bg-black/5 text-black hover:bg-black/10'}`} onClick={() => setChartView('orders')}>
              Orders
            </button>
            <button className={`px-3 py-1 rounded-md text-sm ${chartView === 'revenue' ? 'bg-black text-white' : 'bg-black/5 text-black hover:bg-black/10'}`} onClick={() => setChartView('revenue')}>
              Revenue
            </button>
            <button className={`px-3 py-1 rounded-md text-sm ${chartView === 'combined' ? 'bg-black text-white' : 'bg-black/5 text-black hover:bg-black/10'}`} onClick={() => setChartView('combined')}>
              Combined
            </button>
          </div>
        </div>
        <div className="h-80">
          <LineChart chartView={chartView} />
        </div>
        <div className="flex justify-end mt-4">
          <button className="flex items-center px-3 py-1 bg-black/5 text-black rounded-md hover:bg-black/10 text-sm">
            <DownloadIcon size={16} className="mr-1" />
            Export as PNG
          </button>
          <button className="flex items-center px-3 py-1 bg-black/5 text-black rounded-md hover:bg-black/10 text-sm ml-2">
            <FileTextIcon size={16} className="mr-1" />
            Export as CSV
          </button>
        </div>
      </div>
    </div>;
};
export default Overview;