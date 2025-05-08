import React, { useState } from 'react';
import { SearchIcon, FilterIcon, DownloadIcon, ChevronLeftIcon, ChevronRightIcon, PlusIcon, PackageIcon, AlertCircleIcon, ArchiveIcon, EditIcon, TrashIcon, ChevronUpIcon, ChevronDownIcon, HistoryIcon, BoxIcon, LayersIcon, BarChart2Icon } from 'lucide-react';
const Inventory = () => {
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState('stock');
  const [sortDirection, setSortDirection] = useState('asc');
  // Mock data for inventory
  const inventory = [{
    id: 'PRD-001',
    name: 'Soybean Oil - 1L',
    sku: 'SBO-1L',
    category: 'Cooking Oil',
    stock: 150,
    minStock: 50,
    maxStock: 500,
    location: 'Warehouse A',
    unitPrice: '2,500 RWF',
    lastUpdated: '2025-04-21 10:30',
    status: 'In Stock'
  }, {
    id: 'PRD-002',
    name: 'Soybean Oil - 5L',
    sku: 'SBO-5L',
    category: 'Cooking Oil',
    stock: 45,
    minStock: 40,
    maxStock: 200,
    location: 'Warehouse A',
    unitPrice: '11,000 RWF',
    lastUpdated: '2025-04-21 09:15',
    status: 'Low Stock'
  }, {
    id: 'PRD-003',
    name: 'Soybean Oil - 20L',
    sku: 'SBO-20L',
    category: 'Cooking Oil',
    stock: 25,
    minStock: 20,
    maxStock: 100,
    location: 'Warehouse B',
    unitPrice: '40,000 RWF',
    lastUpdated: '2025-04-21 11:45',
    status: 'Low Stock'
  }, {
    id: 'PRD-004',
    name: 'Soybean Meal - 50kg',
    sku: 'SBM-50KG',
    category: 'Animal Feed',
    stock: 200,
    minStock: 100,
    maxStock: 1000,
    location: 'Warehouse B',
    unitPrice: '35,000 RWF',
    lastUpdated: '2025-04-21 08:20',
    status: 'In Stock'
  }, {
    id: 'PRD-005',
    name: 'Raw Soybeans - 100kg',
    sku: 'RSB-100KG',
    category: 'Raw Materials',
    stock: 5,
    minStock: 50,
    maxStock: 500,
    location: 'Warehouse C',
    unitPrice: '120,000 RWF',
    lastUpdated: '2025-04-21 07:30',
    status: 'Out of Stock'
  }];
  // Calculate inventory statistics
  const stats = {
    totalProducts: inventory.length,
    totalValue: inventory.reduce((sum, item) => sum + parseInt(item.unitPrice.replace(/[^\d]/g, '')) * item.stock, 0),
    lowStock: inventory.filter(item => item.stock <= item.minStock).length,
    outOfStock: inventory.filter(item => item.stock === 0).length
  };
  // Sort inventory
  const sortedInventory = [...inventory].sort((a, b) => {
    const direction = sortDirection === 'asc' ? 1 : -1;
    switch (sortField) {
      case 'stock':
        return (a.stock - b.stock) * direction;
      case 'price':
        return (parseInt(a.unitPrice.replace(/[^\d]/g, '')) - parseInt(b.unitPrice.replace(/[^\d]/g, ''))) * direction;
      case 'name':
        return a.name.localeCompare(b.name) * direction;
      default:
        return 0;
    }
  });
  // Filter inventory
  const filteredInventory = sortedInventory.filter(item => {
    // Filter by status
    if (filter !== 'all') {
      if (filter === 'low' && item.stock > item.minStock) return false;
      if (filter === 'out' && item.stock !== 0) return false;
      if (filter === 'in' && (item.stock <= item.minStock || item.stock === 0)) return false;
    }
    // Filter by category
    if (categoryFilter !== 'all' && item.category !== categoryFilter) {
      return false;
    }
    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return item.name.toLowerCase().includes(query) || item.sku.toLowerCase().includes(query) || item.category.toLowerCase().includes(query);
    }
    return true;
  });
  // Calculate pagination
  const totalPages = Math.ceil(filteredInventory.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedInventory = filteredInventory.slice(startIndex, startIndex + rowsPerPage);
  // Status badge styles
  const getStatusBadgeClass = status => {
    switch (status) {
      case 'In Stock':
        return 'bg-green-100 text-green-800';
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock':
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
      setSortDirection('asc');
    }
  };
  return <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Inventory</h1>
          <p className="text-black/60 mt-1">
            Manage and track product inventory
          </p>
        </div>
        <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-black/80 transition-colors">
          <PlusIcon size={16} className="inline-block mr-2" />
          Add New Product
        </button>
      </div>
      {/* Inventory Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-black/5 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-black/70">
              <BoxIcon size={24} />
            </div>
            <span className="text-2xl font-bold">{stats.totalProducts}</span>
          </div>
          <div className="mt-2 text-sm font-medium text-black/70">
            Total Products
          </div>
        </div>
        <div className="bg-black/5 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-black/70">
              <BarChart2Icon size={24} />
            </div>
            <span className="text-2xl font-bold">
              {new Intl.NumberFormat('en-US').format(stats.totalValue)} RWF
            </span>
          </div>
          <div className="mt-2 text-sm font-medium text-black/70">
            Total Value
          </div>
        </div>
        <div className="bg-black/5 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-black/70">
              <AlertCircleIcon size={24} />
            </div>
            <span className="text-2xl font-bold">{stats.lowStock}</span>
          </div>
          <div className="mt-2 text-sm font-medium text-black/70">
            Low Stock Items
          </div>
        </div>
        <div className="bg-black/5 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-black/70">
              <PackageIcon size={24} />
            </div>
            <span className="text-2xl font-bold">{stats.outOfStock}</span>
          </div>
          <div className="mt-2 text-sm font-medium text-black/70">
            Out of Stock
          </div>
        </div>
      </div>
      {/* Low Stock Alert */}
      {stats.lowStock > 0 && <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md">
          <div className="flex items-center">
            <AlertCircleIcon size={20} className="text-yellow-500 mr-2" />
            <p className="text-yellow-700 font-medium">
              {stats.lowStock} product{stats.lowStock > 1 ? 's' : ''} running
              low on stock
            </p>
          </div>
        </div>}
      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg border border-black/10 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-black/70 mb-1">
              Stock Status
            </label>
            <select id="status-filter" className="w-full border border-black/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/50" value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="in">In Stock</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>
          <div>
            <label htmlFor="category-filter" className="block text-sm font-medium text-black/70 mb-1">
              Category
            </label>
            <select id="category-filter" className="w-full border border-black/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/50" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
              <option value="all">All Categories</option>
              <option value="Cooking Oil">Cooking Oil</option>
              <option value="Animal Feed">Animal Feed</option>
              <option value="Raw Materials">Raw Materials</option>
            </select>
          </div>
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-black/70 mb-1">
              Search
            </label>
            <div className="relative">
              <input type="text" id="search" className="w-full border border-black/20 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/50" placeholder="Search products..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
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
            <span className="font-medium">{filteredInventory.length}</span>{' '}
            products
          </div>
        </div>
      </div>
      {/* Inventory Table */}
      <div className="bg-white rounded-lg border border-black/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-black/5 border-b border-black/10">
                <th className="px-4 py-3 text-left text-xs font-medium text-black/70 uppercase tracking-wider">
                  Product Info
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-black/70 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-black/70 uppercase tracking-wider cursor-pointer group" onClick={() => handleSort('stock')}>
                  <div className="flex items-center">
                    Stock Level
                    {sortField === 'stock' ? sortDirection === 'asc' ? <ChevronUpIcon size={16} className="ml-1" /> : <ChevronDownIcon size={16} className="ml-1" /> : <ChevronUpIcon size={16} className="ml-1 opacity-0 group-hover:opacity-50" />}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-black/70 uppercase tracking-wider cursor-pointer group" onClick={() => handleSort('price')}>
                  <div className="flex items-center">
                    Unit Price
                    {sortField === 'price' ? sortDirection === 'asc' ? <ChevronUpIcon size={16} className="ml-1" /> : <ChevronDownIcon size={16} className="ml-1" /> : <ChevronUpIcon size={16} className="ml-1 opacity-0 group-hover:opacity-50" />}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-black/70 uppercase tracking-wider">
                  Location
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
              {paginatedInventory.map(item => <tr key={item.id} className="hover:bg-black/5">
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium">{item.name}</div>
                    <div className="text-xs text-black/60">{item.sku}</div>
                  </td>
                  <td className="px-4 py-3 text-sm">{item.category}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium">
                      {item.stock} units
                    </div>
                    <div className="text-xs text-black/60">
                      Min: {item.minStock} / Max: {item.maxStock}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">
                    {item.unitPrice}
                  </td>
                  <td className="px-4 py-3 text-sm">{item.location}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button className="p-1 bg-black/5 rounded hover:bg-black/10" title="Edit Product">
                        <EditIcon size={16} />
                      </button>
                      <button className="p-1 bg-black/5 rounded hover:bg-black/10" title="Stock History">
                        <HistoryIcon size={16} />
                      </button>
                      <button className="p-1 bg-black/5 rounded hover:bg-black/10" title="Archive Product">
                        <ArchiveIcon size={16} />
                      </button>
                      <button className="p-1 bg-red-50 text-red-600 rounded hover:bg-red-100" title="Delete Product">
                        <TrashIcon size={16} />
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
export default Inventory;