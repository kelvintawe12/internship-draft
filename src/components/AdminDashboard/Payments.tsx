import React, { useState } from 'react';
import { SearchIcon, FilterIcon, DownloadIcon, ChevronLeftIcon, ChevronRightIcon, EyeIcon, CheckCircleIcon, XCircleIcon, ClockIcon, CreditCardIcon, WalletIcon, DollarSignIcon, ReceiptIcon, AlertCircleIcon, ChevronUpIcon, ChevronDownIcon } from 'lucide-react';
const Payments = () => {
  const [filter, setFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  // Mock data for payments
  const payments = [{
    id: 'PAY-20250421-001',
    orderId: 'MMS-C123-20250421-0639',
    customerName: 'John Doe',
    amount: '25,000 RWF',
    method: 'Mobile Money',
    status: 'Completed',
    date: '2025-04-21 06:45',
    reference: 'MM-123456789',
    notes: ''
  }, {
    id: 'PAY-20250421-002',
    orderId: 'MMS-C124-20250421-0745',
    customerName: 'Jane Smith',
    amount: '45,000 RWF',
    method: 'Bank Transfer',
    status: 'Pending',
    date: '2025-04-21 07:50',
    reference: 'BT-987654321',
    notes: 'Awaiting bank confirmation'
  }, {
    id: 'PAY-20250421-003',
    orderId: 'MMS-C125-20250421-0830',
    customerName: 'Robert Johnson',
    amount: '15,000 RWF',
    method: 'Cash on Delivery',
    status: 'Pending',
    date: '2025-04-21 08:35',
    reference: 'COD-456789123',
    notes: 'Cash payment on delivery'
  }, {
    id: 'PAY-20250421-004',
    orderId: 'MMS-C126-20250421-0915',
    customerName: 'Mary Williams',
    amount: '40,000 RWF',
    method: 'Mobile Money',
    status: 'Failed',
    date: '2025-04-21 09:20',
    reference: 'MM-789123456',
    notes: 'Transaction timeout'
  }, {
    id: 'PAY-20250421-005',
    orderId: 'MMS-C127-20250421-1022',
    customerName: 'David Brown',
    amount: '100,000 RWF',
    method: 'Bank Transfer',
    status: 'Completed',
    date: '2025-04-21 10:30',
    reference: 'BT-654321987',
    notes: ''
  }];
  // Calculate totals for metrics
  const totalPayments = payments.reduce((sum, payment) => sum + parseInt(payment.amount.replace(/[^\d]/g, '')), 0);
  const pendingPayments = payments.filter(p => p.status === 'Pending').length;
  const completedPayments = payments.filter(p => p.status === 'Completed').length;
  const failedPayments = payments.filter(p => p.status === 'Failed').length;
  // Sort payments
  const sortedPayments = [...payments].sort((a, b) => {
    const direction = sortDirection === 'asc' ? 1 : -1;
    switch (sortField) {
      case 'date':
        return (new Date(a.date).getTime() - new Date(b.date).getTime()) * direction;
      case 'amount':
        return (parseInt(a.amount.replace(/[^\d]/g, '')) - parseInt(b.amount.replace(/[^\d]/g, ''))) * direction;
      default:
        return 0;
    }
  });
  // Filter payments
  const filteredPayments = sortedPayments.filter(payment => {
    // Filter by status
    if (filter !== 'all' && payment.status !== filter) {
      return false;
    }
    // Filter by payment method
    if (methodFilter !== 'all' && payment.method !== methodFilter) {
      return false;
    }
    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return payment.id.toLowerCase().includes(query) || payment.orderId.toLowerCase().includes(query) || payment.customerName.toLowerCase().includes(query) || payment.reference.toLowerCase().includes(query);
    }
    return true;
  });
  // Calculate pagination
  const totalPages = Math.ceil(filteredPayments.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedPayments = filteredPayments.slice(startIndex, startIndex + rowsPerPage);
  // Status badge styles
  const getStatusBadgeClass = status => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  // Payment method icon
  const getMethodIcon = method => {
    switch (method) {
      case 'Mobile Money':
        return <WalletIcon size={16} className="mr-1.5" />;
      case 'Bank Transfer':
        return <div size={16} className="mr-1.5" />;
      case 'Cash on Delivery':
        return <DollarSignIcon size={16} className="mr-1.5" />;
      default:
        return <CreditCardIcon size={16} className="mr-1.5" />;
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
  return <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Payments</h1>
          <p className="text-black/60 mt-1">
            Track and manage payment transactions
          </p>
        </div>
        <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-black/80 transition-colors">
          Record New Payment
        </button>
      </div>
      {/* Payment Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-black/5 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-black/70">
              <DollarSignIcon size={24} />
            </div>
            <span className="text-2xl font-bold">
              {new Intl.NumberFormat('en-US').format(totalPayments)} RWF
            </span>
          </div>
          <div className="mt-2 text-sm font-medium text-black/70">
            Total Payments
          </div>
        </div>
        <div className="bg-black/5 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-black/70">
              <CheckCircleIcon size={24} />
            </div>
            <span className="text-2xl font-bold">{completedPayments}</span>
          </div>
          <div className="mt-2 text-sm font-medium text-black/70">
            Completed Payments
          </div>
        </div>
        <div className="bg-black/5 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-black/70">
              <ClockIcon size={24} />
            </div>
            <span className="text-2xl font-bold">{pendingPayments}</span>
          </div>
          <div className="mt-2 text-sm font-medium text-black/70">
            Pending Payments
          </div>
        </div>
        <div className="bg-black/5 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-black/70">
              <XCircleIcon size={24} />
            </div>
            <span className="text-2xl font-bold">{failedPayments}</span>
          </div>
          <div className="mt-2 text-sm font-medium text-black/70">
            Failed Payments
          </div>
        </div>
      </div>
      {/* Alert for pending verifications */}
      {pendingPayments > 0 && <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md">
          <div className="flex items-center">
            <AlertCircleIcon size={20} className="text-yellow-500 mr-2" />
            <p className="text-yellow-700 font-medium">
              {pendingPayments} payment{pendingPayments > 1 ? 's' : ''} pending
              verification
            </p>
          </div>
        </div>}
      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg border border-black/10 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-black/70 mb-1">
              Status
            </label>
            <select id="status-filter" className="w-full border border-black/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/50" value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
          <div>
            <label htmlFor="method-filter" className="block text-sm font-medium text-black/70 mb-1">
              Payment Method
            </label>
            <select id="method-filter" className="w-full border border-black/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/50" value={methodFilter} onChange={e => setMethodFilter(e.target.value)}>
              <option value="all">All Methods</option>
              <option value="Mobile Money">Mobile Money</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cash on Delivery">Cash on Delivery</option>
            </select>
          </div>
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-black/70 mb-1">
              Search
            </label>
            <div className="relative">
              <input type="text" id="search" className="w-full border border-black/20 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/50" placeholder="Search by ID, order, customer..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
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
            <span className="font-medium">{filteredPayments.length}</span>{' '}
            payments
          </div>
        </div>
      </div>
      {/* Payments Table */}
      <div className="bg-white rounded-lg border border-black/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-black/5 border-b border-black/10">
                <th className="px-4 py-3 text-left text-xs font-medium text-black/70 uppercase tracking-wider">
                  Payment Details
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-black/70 uppercase tracking-wider">
                  Order & Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-black/70 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-black/70 uppercase tracking-wider cursor-pointer group" onClick={() => handleSort('amount')}>
                  <div className="flex items-center">
                    Amount
                    {sortField === 'amount' ? sortDirection === 'asc' ? <ChevronUpIcon size={16} className="ml-1" /> : <ChevronDownIcon size={16} className="ml-1" /> : <ChevronUpIcon size={16} className="ml-1 opacity-0 group-hover:opacity-50" />}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-black/70 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-black/70 uppercase tracking-wider cursor-pointer group" onClick={() => handleSort('date')}>
                  <div className="flex items-center">
                    Date
                    {sortField === 'date' ? sortDirection === 'asc' ? <ChevronUpIcon size={16} className="ml-1" /> : <ChevronDownIcon size={16} className="ml-1" /> : <ChevronUpIcon size={16} className="ml-1 opacity-0 group-hover:opacity-50" />}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-black/70 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {paginatedPayments.map(payment => <tr key={payment.id} className="hover:bg-black/5">
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium">{payment.id}</div>
                    <div className="text-xs text-black/60">
                      {payment.reference}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">{payment.customerName}</div>
                    <div className="text-xs text-black/60">
                      {payment.orderId}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center text-sm">
                      {getMethodIcon(payment.method)}
                      {payment.method}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">
                    {payment.amount}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-black/60">
                    {payment.date}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button className="p-1 bg-black/5 rounded hover:bg-black/10" title="View Details">
                        <EyeIcon size={16} />
                      </button>
                      <button className="p-1 bg-black/5 rounded hover:bg-black/10" title="Download Receipt">
                        <ReceiptIcon size={16} />
                      </button>
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
export default Payments;