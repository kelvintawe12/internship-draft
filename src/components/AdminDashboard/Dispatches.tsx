import React, { useState } from 'react';
import { SearchIcon, FilterIcon, DownloadIcon, ChevronLeftIcon, ChevronRightIcon, EyeIcon, PhoneIcon, UserIcon, MapPinIcon, AlertCircleIcon } from 'lucide-react';
const Dispatches = () => {
  const [filter, setFilter] = useState('all');
  const [driverFilter, setDriverFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // Mock data for dispatches
  const dispatches = [{
    orderId: 'MMS-C123-20250421-0639',
    clientName: 'John Doe',
    deliveryAddress: 'KG 123 St, Kigali',
    scheduledDate: '2025-04-23',
    status: 'Delivered',
    driverName: 'Paul Kagame',
    driverContact: '+250788123456',
    vehicleId: 'RW-123-XYZ',
    lastUpdated: '2025-04-23 14:30',
    priority: 'Normal'
  }, {
    orderId: 'MMS-C124-20250421-0745',
    clientName: 'Jane Smith',
    deliveryAddress: 'KN 75 St, Kigali',
    scheduledDate: '2025-04-24',
    status: 'In Transit',
    driverName: 'Eric Mugisha',
    driverContact: '+250788234567',
    vehicleId: 'RW-456-ABC',
    lastUpdated: '2025-04-24 09:15',
    priority: 'High'
  }, {
    orderId: 'MMS-C125-20250421-0830',
    clientName: 'Robert Johnson',
    deliveryAddress: 'KK 44 Ave, Kigali',
    scheduledDate: '2025-04-25',
    status: 'Scheduled',
    driverName: 'Jean Pierre',
    driverContact: '+250788345678',
    vehicleId: 'RW-789-DEF',
    lastUpdated: '2025-04-24 16:00',
    priority: 'Normal'
  }, {
    orderId: 'MMS-C126-20250421-0915',
    clientName: 'Mary Williams',
    deliveryAddress: 'KN 12 St, Kigali',
    scheduledDate: '2025-04-24',
    status: 'Failed',
    driverName: 'Alex Uwimana',
    driverContact: '+250788456789',
    vehicleId: 'RW-012-GHI',
    lastUpdated: '2025-04-24 11:45',
    priority: 'Normal'
  }, {
    orderId: 'MMS-C127-20250421-1022',
    clientName: 'David Brown',
    deliveryAddress: 'KG 55 Ave, Kigali',
    scheduledDate: '2025-04-26',
    status: 'Delayed',
    driverName: 'Claude Ndayishimiye',
    driverContact: '+250788567890',
    vehicleId: 'RW-345-JKL',
    lastUpdated: '2025-04-24 13:20',
    priority: 'High'
  }];
  // Filter dispatches based on selected filters and search query
  const filteredDispatches = dispatches.filter(dispatch => {
    // Filter by status
    if (filter !== 'all' && dispatch.status !== filter) {
      return false;
    }
    // Filter by driver
    if (driverFilter !== 'all' && dispatch.driverName !== driverFilter) {
      return false;
    }
    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return dispatch.orderId.toLowerCase().includes(query) || dispatch.clientName.toLowerCase().includes(query) || dispatch.driverName.toLowerCase().includes(query) || dispatch.deliveryAddress.toLowerCase().includes(query);
    }
    return true;
  });
  // Calculate pagination
  const totalPages = Math.ceil(filteredDispatches.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedDispatches = filteredDispatches.slice(startIndex, startIndex + rowsPerPage);
  // Status badge styles
  const getStatusBadgeClass = status => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'In Transit':
        return 'bg-blue-100 text-blue-800';
      case 'Scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      case 'Delayed':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  // Priority badge styles
  const getPriorityBadgeClass = priority => {
    switch (priority) {
      case 'High':
        return 'bg-red-50 text-red-700 border border-red-200';
      case 'Normal':
        return 'bg-gray-50 text-gray-700 border border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };
  return <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Dispatches</h1>
        <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-black/80 transition-colors">
          Assign New Dispatch
        </button>
      </div>
      {/* Alert for delayed deliveries */}
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
        <div className="flex items-center">
          <AlertCircleIcon size={20} className="text-red-500 mr-2" />
          <p className="text-red-700 font-medium">
            2 deliveries are delayed! Immediate attention required.
          </p>
        </div>
      </div>
      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg border border-black/10 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-black/70 mb-1">
              Status
            </label>
            <select id="status-filter" className="w-full border border-black/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/50" value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="Scheduled">Scheduled</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
              <option value="Delayed">Delayed</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
          <div>
            <label htmlFor="driver-filter" className="block text-sm font-medium text-black/70 mb-1">
              Driver
            </label>
            <select id="driver-filter" className="w-full border border-black/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/50" value={driverFilter} onChange={e => setDriverFilter(e.target.value)}>
              <option value="all">All Drivers</option>
              {Array.from(new Set(dispatches.map(d => d.driverName))).map(driver => <option key={driver} value={driver}>
                    {driver}
                  </option>)}
            </select>
          </div>
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-black/70 mb-1">
              Search
            </label>
            <div className="relative">
              <input type="text" id="search" className="w-full border border-black/20 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/50" placeholder="Search by order ID, client, driver..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              <SearchIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/40" />
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center">
            <button className="flex items-center px-3 py-1 bg-black/5 text-black rounded-md hover:bg-black/10 text-sm">
              <FilterIcon size={16} className="mr-1" />
              More Filters
            </button>
            <button className="flex items-center px-3 py-1 bg-black/5 text-black rounded-md hover:bg-black/10 text-sm ml-2">
              <DownloadIcon size={16} className="mr-1" />
              Export
            </button>
          </div>
          <div className="text-sm text-black/70">
            Showing{' '}
            <span className="font-medium">{filteredDispatches.length}</span>{' '}
            dispatches
          </div>
        </div>
      </div>
      {/* Dispatches Table */}
      <div className="bg-white rounded-lg border border-black/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-black/5 border-b border-black/10">
                <th className="px-4 py-3 text-left text-xs font-medium text-black/70 uppercase tracking-wider">
                  Order Info
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-black/70 uppercase tracking-wider">
                  Delivery Details
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-black/70 uppercase tracking-wider">
                  Driver Info
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-black/70 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-black/70 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {paginatedDispatches.map(dispatch => <tr key={dispatch.orderId} className="hover:bg-black/5">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium">
                      {dispatch.orderId}
                    </div>
                    <div className="text-sm text-black/60">
                      {dispatch.clientName}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-start">
                      <MapPinIcon size={16} className="mt-1 mr-1 flex-shrink-0 text-black/60" />
                      <div>
                        <div className="text-sm">
                          {dispatch.deliveryAddress}
                        </div>
                        <div className="text-xs text-black/60">
                          Scheduled: {dispatch.scheduledDate}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <UserIcon size={16} className="mr-1 text-black/60" />
                      <div>
                        <div className="text-sm">{dispatch.driverName}</div>
                        <div className="text-xs text-black/60">
                          {dispatch.vehicleId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(dispatch.status)}`}>
                      {dispatch.status}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ml-2 ${getPriorityBadgeClass(dispatch.priority)}`}>
                      {dispatch.priority}
                    </span>
                    <div className="text-xs text-black/60 mt-1">
                      Last updated: {dispatch.lastUpdated}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button className="p-1 bg-black/5 rounded hover:bg-black/10" title="View Details">
                        <EyeIcon size={16} />
                      </button>
                      <a href={`tel:${dispatch.driverContact}`} className="p-1 bg-black/5 rounded hover:bg-black/10" title="Call Driver">
                        <PhoneIcon size={16} />
                      </a>
                    </div>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="px-4 py-3 border-t border-black/10 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-sm text-black/70">Rows per page:</span>
            <select className="ml-2 border border-black/20 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-black/50" value={rowsPerPage} onChange={e => setRowsPerPage(Number(e.target.value))}>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-1 rounded-md hover:bg-black/5 disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
              <ChevronLeftIcon size={20} />
            </button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button className="p-1 rounded-md hover:bg-black/5 disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
              <ChevronRightIcon size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>;
};
export default Dispatches;