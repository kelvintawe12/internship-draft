import React, { useState } from 'react';
import { SearchIcon, FilterIcon, DownloadIcon, ChevronLeftIcon, ChevronRightIcon, EyeIcon, MailIcon, PhoneIcon, MapPinIcon, StarIcon, UserIcon, ShoppingBagIcon, CalendarIcon, ChevronUpIcon, ChevronDownIcon } from 'lucide-react';
const Customers = () => {
  const [filter, setFilter] = useState('all');
  const [segmentFilter, setSegmentFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState('lastOrder');
  const [sortDirection, setSortDirection] = useState('desc');
  // Mock data for customers
  const customers = [{
    id: 'CUST-001',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+250788123456',
    address: 'KG 123 St, Kigali',
    totalOrders: 15,
    totalSpent: '375,000 RWF',
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
    totalSpent: '180,000 RWF',
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
    totalSpent: '45,000 RWF',
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
    totalSpent: '280,000 RWF',
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
    totalSpent: '15,000 RWF',
    lastOrderDate: '2025-04-15',
    segment: 'New',
    language: 'English',
    joinDate: '2025-04-15',
    status: 'Inactive',
    notes: 'First-time customer'
  }];
  // Sort customers
  const sortedCustomers = [...customers].sort((a, b) => {
    const direction = sortDirection === 'asc' ? 1 : -1;
    switch (sortField) {
      case 'totalOrders':
        return (a.totalOrders - b.totalOrders) * direction;
      case 'totalSpent':
        return (parseInt(a.totalSpent.replace(/[^\d]/g, '')) - parseInt(b.totalSpent.replace(/[^\d]/g, ''))) * direction;
      case 'lastOrder':
        return (new Date(a.lastOrderDate).getTime() - new Date(b.lastOrderDate).getTime()) * direction;
      default:
        return 0;
    }
  });
  // Filter customers
  const filteredCustomers = sortedCustomers.filter(customer => {
    // Filter by status
    if (filter !== 'all' && customer.status !== filter) {
      return false;
    }
    // Filter by segment
    if (segmentFilter !== 'all' && customer.segment !== segmentFilter) {
      return false;
    }
    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return customer.name.toLowerCase().includes(query) || customer.email.toLowerCase().includes(query) || customer.phone.includes(query) || customer.id.toLowerCase().includes(query);
    }
    return true;
  });
  // Calculate pagination
  const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + rowsPerPage);
  // Customer segment badge styles
  const getSegmentBadgeClass = segment => {
    switch (segment) {
      case 'VIP':
        return 'bg-purple-100 text-purple-800';
      case 'Regular':
        return 'bg-blue-100 text-blue-800';
      case 'New':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  // Status badge styles
  const getStatusBadgeClass = status => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  // Sort handler
  const handleSort = field => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  // Sort icon component
  const SortIcon = ({
    field
  }) => {
    if (sortField !== field) return <ChevronUpIcon size={16} className="opacity-0 group-hover:opacity-50" />;
    return sortDirection === 'asc' ? <ChevronUpIcon size={16} className="text-black" /> : <ChevronDownIcon size={16} className="text-black" />;
  };
  return <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-black/60 mt-1">
            Manage and track customer information
          </p>
        </div>
        <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-black/80 transition-colors">
          + Add New Customer
        </button>
      </div>
      {/* Customer Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-black/5 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-black/70">
              <UserIcon size={24} />
            </div>
            <span className="text-2xl font-bold">{customers.length}</span>
          </div>
          <div className="mt-2 text-sm font-medium text-black/70">
            Total Customers
          </div>
        </div>
        <div className="bg-black/5 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-black/70">
              <StarIcon size={24} />
            </div>
            <span className="text-2xl font-bold">
              {customers.filter(c => c.segment === 'VIP').length}
            </span>
          </div>
          <div className="mt-2 text-sm font-medium text-black/70">
            VIP Customers
          </div>
        </div>
        <div className="bg-black/5 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-black/70">
              <ShoppingBagIcon size={24} />
            </div>
            <span className="text-2xl font-bold">
              {customers.reduce((sum, c) => sum + c.totalOrders, 0)}
            </span>
          </div>
          <div className="mt-2 text-sm font-medium text-black/70">
            Total Orders
          </div>
        </div>
        <div className="bg-black/5 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-black/70">
              <CalendarIcon size={24} />
            </div>
            <span className="text-2xl font-bold">
              {customers.filter(c => new Date(c.joinDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
            </span>
          </div>
          <div className="mt-2 text-sm font-medium text-black/70">
            New This Month
          </div>
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
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label htmlFor="segment-filter" className="block text-sm font-medium text-black/70 mb-1">
              Segment
            </label>
            <select id="segment-filter" className="w-full border border-black/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/50" value={segmentFilter} onChange={e => setSegmentFilter(e.target.value)}>
              <option value="all">All Segments</option>
              <option value="VIP">VIP</option>
              <option value="Regular">Regular</option>
              <option value="New">New</option>
            </select>
          </div>
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-black/70 mb-1">
              Search
            </label>
            <div className="relative">
              <input type="text" id="search" className="w-full border border-black/20 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/50" placeholder="Search by name, email, phone..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
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
            <span className="font-medium">{filteredCustomers.length}</span>{' '}
            customers
          </div>
        </div>
      </div>
      {/* Customers Table */}
      <div className="bg-white rounded-lg border border-black/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-black/5 border-b border-black/10">
                <th className="px-4 py-3 text-left text-xs font-medium text-black/70 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-black/70 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-black/70 uppercase tracking-wider cursor-pointer group" onClick={() => handleSort('totalOrders')}>
                  <div className="flex items-center">
                    Orders
                    <SortIcon field="totalOrders" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-black/70 uppercase tracking-wider cursor-pointer group" onClick={() => handleSort('totalSpent')}>
                  <div className="flex items-center">
                    Total Spent
                    <SortIcon field="totalSpent" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-black/70 uppercase tracking-wider cursor-pointer group" onClick={() => handleSort('lastOrder')}>
                  <div className="flex items-center">
                    Last Order
                    <SortIcon field="lastOrder" />
                  </div>
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
              {paginatedCustomers.map(customer => <tr key={customer.id} className="hover:bg-black/5">
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center">
                        <UserIcon size={16} className="text-black/70" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium">
                          {customer.name}
                        </div>
                        <div className="text-xs text-black/60">
                          {customer.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <MailIcon size={14} className="mr-1 text-black/60" />
                        {customer.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <PhoneIcon size={14} className="mr-1 text-black/60" />
                        {customer.phone}
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPinIcon size={14} className="mr-1 text-black/60" />
                        {customer.address}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <div className="font-medium">{customer.totalOrders}</div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSegmentBadgeClass(customer.segment)}`}>
                      {customer.segment}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                    {customer.totalSpent}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-black/60">
                    {customer.lastOrderDate}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(customer.status)}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button className="p-1 bg-black/5 rounded hover:bg-black/10" title="View Profile">
                        <EyeIcon size={16} />
                      </button>
                      <button className="p-1 bg-black/5 rounded hover:bg-black/10" title="Send Email">
                        <MailIcon size={16} />
                      </button>
                      <a href={`tel:${customer.phone}`} className="p-1 bg-black/5 rounded hover:bg-black/10" title="Call Customer">
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
export default Customers;