import React, { useState } from 'react';
import { SearchIcon, FilterIcon, DownloadIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, EyeIcon, EditIcon, CreditCardIcon, FileTextIcon } from 'lucide-react';
const Orders = () => {
  const [filter, setFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [deliveryFilter, setDeliveryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // Mock data for orders
  const orders = [{
    id: 'MMS-C123-20250421-0639',
    clientName: 'John Doe',
    phone: '+250788123456',
    email: 'john@example.com',
    products: '5L Oil x 2, 1L Oil x 1',
    amount: '25,000 RWF',
    paymentMethod: 'Mobile Money',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    orderDate: '2025-04-21 06:39',
    deliveryDate: '2025-04-23',
    deliveryStatus: 'On Time'
  }, {
    id: 'MMS-C124-20250421-0745',
    clientName: 'Jane Smith',
    phone: '+250788234567',
    email: 'jane@example.com',
    products: '20L Oil x 1',
    amount: '45,000 RWF',
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'Pending',
    orderStatus: 'Shipped',
    orderDate: '2025-04-21 07:45',
    deliveryDate: '2025-04-24',
    deliveryStatus: 'On Time'
  }, {
    id: 'MMS-C125-20250421-0830',
    clientName: 'Robert Johnson',
    phone: '+250788345678',
    email: 'robert@example.com',
    products: '1L Oil x 5',
    amount: '15,000 RWF',
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Pending',
    orderStatus: 'Pending',
    orderDate: '2025-04-21 08:30',
    deliveryDate: '2025-04-25',
    deliveryStatus: 'Pending'
  }, {
    id: 'MMS-C126-20250421-0915',
    clientName: 'Mary Williams',
    phone: '+250788456789',
    email: 'mary@example.com',
    products: '5L Oil x 3, 1L Oil x 2',
    amount: '40,000 RWF',
    paymentMethod: 'Mobile Money',
    paymentStatus: 'Failed',
    orderStatus: 'Cancelled',
    orderDate: '2025-04-21 09:15',
    deliveryDate: '2025-04-24',
    deliveryStatus: 'Cancelled'
  }, {
    id: 'MMS-C127-20250421-1022',
    clientName: 'David Brown',
    phone: '+250788567890',
    email: 'david@example.com',
    products: '20L Oil x 2, 5L Oil x 1',
    amount: '100,000 RWF',
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'Paid',
    orderStatus: 'Shipped',
    orderDate: '2025-04-21 10:22',
    deliveryDate: '2025-04-26',
    deliveryStatus: 'Delayed'
  }];
  // Filter orders based on selected filters and search query
  const filteredOrders = orders.filter(order => {
    // Filter by order status
    if (filter !== 'all' && order.orderStatus !== filter) {
      return false;
    }
    // Filter by payment status
    if (paymentFilter !== 'all' && order.paymentStatus !== paymentFilter) {
      return false;
    }
    // Filter by delivery status
    if (deliveryFilter !== 'all' && order.deliveryStatus !== deliveryFilter) {
      return false;
    }
    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return order.id.toLowerCase().includes(query) || order.clientName.toLowerCase().includes(query) || order.phone.includes(query) || order.email && order.email.toLowerCase().includes(query);
    }
    return true;
  });
  // Calculate pagination
  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + rowsPerPage);
  // Status badge styles
  const getStatusBadgeClass = status => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      case 'On Time':
        return 'bg-green-100 text-green-800';
      case 'Delayed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  return <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Orders</h1>
        <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-black/80 transition-colors">
          New Order
        </button>
      </div>
      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg border border-black/10 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-black/70 mb-1">
              Order Status
            </label>
            <select id="status-filter" className="w-full border border-black/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/50" value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label htmlFor="payment-filter" className="block text-sm font-medium text-black/70 mb-1">
              Payment Status
            </label>
            <select id="payment-filter" className="w-full border border-black/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/50" value={paymentFilter} onChange={e => setPaymentFilter(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
          <div>
            <label htmlFor="delivery-filter" className="block text-sm font-medium text-black/70 mb-1">
              Delivery Status
            </label>
            <select id="delivery-filter" className="w-full border border-black/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/50" value={deliveryFilter} onChange={e => setDeliveryFilter(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="On Time">On Time</option>
              <option value="Delayed">Delayed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-black/70 mb-1">
              Search
            </label>
            <div className="relative">
              <input type="text" id="search" className="w-full border border-black/20 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/50" placeholder="Search by ID, name, phone..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
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
            Showing <span className="font-medium">{filteredOrders.length}</span>{' '}
            orders
          </div>
        </div>
      </div>
      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-black/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-black/5 border-b border-black/10">
                <th className="px-4 py-3 text-left text-xs font-medium text-black/70 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-black/70 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-black/70 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-black/70 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-black/70 uppercase tracking-wider">
                  Order Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-black/70 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-black/70 uppercase tracking-wider">
                  Delivery
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-black/70 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {paginatedOrders.map(order => <tr key={order.id} className="hover:bg-black/5">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                    {order.id}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <div>{order.clientName}</div>
                    <div className="text-black/60 text-xs">{order.phone}</div>
                  </td>
                  <td className="px-4 py-3 text-sm">{order.products}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                    {order.amount}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                    <div className="text-black/60 text-xs mt-1">
                      {order.paymentMethod}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(order.deliveryStatus)}`}>
                      {order.deliveryStatus}
                    </span>
                    <div className="text-black/60 text-xs mt-1">
                      {order.deliveryDate}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <button className="p-1 bg-black/5 rounded hover:bg-black/10" title="View Details">
                        <EyeIcon size={16} />
                      </button>
                      <button className="p-1 bg-black/5 rounded hover:bg-black/10" title="Edit Order">
                        <EditIcon size={16} />
                      </button>
                      <button className="p-1 bg-black/5 rounded hover:bg-black/10" title="Verify Payment">
                        <CreditCardIcon size={16} />
                      </button>
                      <button className="p-1 bg-black/5 rounded hover:bg-black/10" title="Download Receipt">
                        <FileTextIcon size={16} />
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
export default Orders;