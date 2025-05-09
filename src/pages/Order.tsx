import React, { useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDownIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import { RootState } from '../store';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'shipped' | 'delivered';
  items: OrderItem[];
}

const HeroSection: React.FC = () => {
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <motion.section
      className="bg-indigo-500 text-white py-8"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-3">
          Your Orders
        </h1>
        <p className="text-sm md:text-base mb-4">
          Track and manage your Mount Meru SoyCo orders
        </p>
        {!isAuthenticated && (
          <Link
            to="/signin"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
            aria-label="Sign In to View Orders"
          >
            Sign In to View Orders
          </Link>
        )}
      </div>
    </motion.section>
  );
};

const FilterSortControls: React.FC<{
  status: string;
  setStatus: (value: string) => void;
  sort: string;
  setSort: (value: string) => void;
}> = ({ status, setStatus, sort, setSort }) => {
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const statuses = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
  ];

  const sortOptions = [
    { value: 'date-desc', label: 'Date: Newest First' },
    { value: 'date-asc', label: 'Date: Oldest First' },
    { value: 'total-asc', label: 'Total: Low to High' },
    { value: 'total-desc', label: 'Total: High to Low' },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative">
        <button
          onClick={() => setIsStatusOpen(!isStatusOpen)}
          className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 text-xs hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500"
          aria-expanded={isStatusOpen}
          aria-label="Filter by status"
        >
          <span>
            {statuses.find((s) => s.value === status)?.label || 'Select Status'}
          </span>
          <ChevronDownIcon className="ml-1 h-4 w-4" />
        </button>
        {isStatusOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
            {statuses.map((stat) => (
              <button
                key={stat.value}
                onClick={() => {
                  setStatus(stat.value);
                  setIsStatusOpen(false);
                }}
                className="block w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-indigo-50 focus:bg-indigo-100"
                aria-label={`Filter by ${stat.label}`}
              >
                {stat.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="relative">
        <button
          onClick={() => setIsSortOpen(!isSortOpen)}
          className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 text-xs hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500"
          aria-expanded={isSortOpen}
          aria-label="Sort orders"
        >
          <span>
            {sortOptions.find((s) => s.value === sort)?.label || 'Sort By'}
          </span>
          <ChevronDownIcon className="ml-1 h-4 w-4" />
        </button>
        {isSortOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setSort(option.value);
                  setIsSortOpen(false);
                }}
                className="block w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-indigo-50 focus:bg-indigo-100"
                aria-label={`Sort by ${option.label}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
  return (
    <motion.div
      className="bg-white shadow-sm rounded-lg p-4 border border-gray-100"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      role="region"
      aria-label={`Order ${order.id}`}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-gray-800">
          Order #{order.id}
        </h3>
        <span
          className={`text-xs font-medium ${
            order.status === 'delivered'
              ? 'text-green-500'
              : order.status === 'shipped'
              ? 'text-blue-500'
              : 'text-yellow-500'
          }`}
        >
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>
      <p className="text-gray-600 text-xs mb-2">
        Placed on: {new Date(order.date).toLocaleDateString()}
      </p>
      <p className="text-gray-600 text-xs mb-2">Total: RWF {order.total.toFixed(2)}</p>
      <div className="mt-2">
        <h4 className="text-xs font-medium text-gray-700 mb-1">Items:</h4>
        <ul className="list-disc list-inside text-xs text-gray-600">
          {order.items.map((item, index) => (
            <li key={index}>
              {item.name} - {item.quantity} x RWF {item.price.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

const Order: React.FC = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const dispatch = useDispatch();
  const orders = useSelector((state: RootState) => state.order.orders as Order[]);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('date-desc');

  useEffect(() => {
    if (isAuthenticated) {
      const fetchOrders = async () => {
        setIsLoading(true);
        try {
          const response = await fetch('/api/orders');
          const data = await response.json();
          dispatch({ type: 'order/setOrders', payload: data });
        } catch (error) {
          toast.error('Failed to fetch orders.', { theme: 'light' });
        } finally {
          setIsLoading(false);
        }
      };
      fetchOrders();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, dispatch]);

  const filteredOrders = orders
    .filter((order) => (status === 'all' ? true : order.status === status))
    .sort((a, b) => {
      if (sort === 'date-asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sort === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sort === 'total-asc') return a.total - b.total;
      if (sort === 'total-desc') return b.total - a.total;
      return 0;
    });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <main className="flex-1 pt-12">
        <HeroSection />
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-4 text-center">Your Orders</h2>
            {isAuthenticated ? (
              <>
                <FilterSortControls
                  status={status}
                  setStatus={setStatus}
                  sort={sort}
                  setSort={setSort}
                />
                {isLoading ? (
                  <Spinner loading={true} variant="fullscreen" />
                ) : filteredOrders.length === 0 ? (
                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p className="text-gray-600 text-xs mb-4">No orders found.</p>
                    <Link
                      to="/products"
                      className="bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs hover:bg-indigo-600 focus:ring-2 focus:ring-indigo-500"
                      aria-label="Shop Now"
                    >
                      Shop Now
                    </Link>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {filteredOrders.map((order) => (
                      <OrderCard key={order.id} order={order} />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-gray-600 text-xs mb-4">
                  Please sign in to view your orders.
                </p>
                <Link
                  to="/signin"
                  className="bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs hover:bg-indigo-600 focus:ring-2 focus:ring-indigo-500"
                  aria-label="Sign In"
                >
                  Sign In
                </Link>
              </motion.div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Order;