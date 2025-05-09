import React, { useState, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { useForm, SubmitHandler } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { CreditCard, FileText, Filter, X, Download } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import ErrorBoundary from '../ErrorBoundary';
import { setInvoices } from '../../store/billingSlice';

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed';
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'mobile';
  lastFour: string;
  expiry?: string;
}

interface FilterFormData {
  status: 'all' | 'pending' | 'paid' | 'failed';
  search: string;
  dateFrom: string;
  dateTo: string;
}

const fetchInvoices = async (page: number, filters: FilterFormData) => {
  const params = new URLSearchParams({
    page: page.toString(),
    status: filters.status,
    search: filters.search,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
  });
  const response = await fetch(`/api/user/billing?${params}`);
  if (!response.ok) throw new Error('Failed to fetch billing information');
  return response.json();
};

const fetchPaymentMethods = async () => {
  const response = await fetch('/api/user/billing/payment-methods');
  if (!response.ok) throw new Error('Failed to fetch payment methods');
  return response.json();
};

const downloadInvoice = async (invoiceId: string) => {
  const response = await fetch(`/api/user/billing/invoices/${invoiceId}/download`);
  if (!response.ok) throw new Error('Failed to download invoice');
  return response.json();
};

const UserBilling: React.FC = () => {
  const { user } = useContext(AuthContext);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const invoices = useSelector((state: RootState) => state.billing.invoices) as Invoice[];
  const [page, setPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { register, handleSubmit, watch, reset } = useForm<FilterFormData>({
    defaultValues: {
      status: 'all',
      search: '',
      dateFrom: '',
      dateTo: '',
    },
  });

  const filters = watch();

  const { data: invoiceData, isLoading: invoicesLoading, error: invoicesError, refetch: refetchInvoices } = useQuery({
    queryKey: ['invoices', page, filters],
    queryFn: () => fetchInvoices(page, filters),
  });

  React.useEffect(() => {
    if (invoiceData) {
      dispatch(setInvoices(invoiceData));
    }
  }, [invoiceData, dispatch]);

  const { data: paymentMethods, isLoading: methodsLoading, error: methodsError } = useQuery({
    queryKey: ['paymentMethods'],
    queryFn: fetchPaymentMethods,
  });

  const downloadMutation = useMutation({
    mutationFn: downloadInvoice,
    onSuccess: () => {
      toast.success('Invoice download started.', { theme: 'light' });
    },
    onError: () => {
      toast.error('Failed to download invoice.', { theme: 'light' });
    },
  });

  const onFilterSubmit: SubmitHandler<FilterFormData> = () => {
    setPage(1);
    refetchInvoices();
  };

  if (invoicesLoading || methodsLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 bg-white shadow-lg rounded-xl max-w-3xl mx-auto"
      >
        <p className="text-sm text-gray-600 text-center">Loading billing information...</p>
      </motion.div>
    );
  }

  if (invoicesError || methodsError) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 bg-white shadow-lg rounded-xl max-w-3xl mx-auto"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Billing Information</h2>
        <div className="text-center">
          <p className="text-sm text-red-600 mb-4">Error: {(invoicesError as Error)?.message || (methodsError as Error)?.message}</p>
          <button
            onClick={() => refetchInvoices()}
            className="flex items-center mx-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            aria-label="Retry fetching billing information"
          >
            <X className="w-4 h-4 mr-2" />
            Retry
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <ErrorBoundary>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 bg-white shadow-lg rounded-xl max-w-3xl mx-auto"
        role="region"
        aria-label="Billing Information"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Billing Information</h2>
        <p className="text-sm text-gray-600 mb-6">View and manage your billing details, payment methods, and invoices.</p>

        {/* Filter Panel */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Invoices</h3>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
            aria-expanded={isFilterOpen}
            aria-controls="filter-panel"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
        </div>
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              id="filter-panel"
              className="bg-gray-50 p-4 rounded-lg mb-6"
            >
              <form onSubmit={handleSubmit(onFilterSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="status"
                    {...register('status')}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                    Search
                  </label>
                  <input
                    id="search"
                    {...register('search')}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Search invoices..."
                  />
                </div>
                <div>
                  <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700">
                    From Date
                  </label>
                  <input
                    id="dateFrom"
                    type="date"
                    {...register('dateFrom')}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700">
                    To Date
                  </label>
                  <input
                    id="dateTo"
                    type="date"
                    {...register('dateTo')}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                <div className="md:col-span-2 flex space-x-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    aria-label="Apply filters"
                  >
                    Apply Filters
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      reset();
                      setPage(1);
                      refetchInvoices();
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
                    aria-label="Reset filters"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Invoices List */}
        {invoices.length === 0 ? (
          <p className="text-sm text-gray-600 text-center">No invoices found.</p>
        ) : (
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            {invoices.map((invoice) => (
              <motion.li
                key={invoice.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 bg-white rounded-lg shadow-sm border flex items-center justify-between hover:bg-gray-50 transition-colors"
                role="article"
                aria-labelledby={`invoice-${invoice.id}`}
              >
                <div>
                  <p id={`invoice-${invoice.id}`} className="text-sm text-gray-800 font-semibold">
                    Invoice #{invoice.id}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(invoice.date).toLocaleDateString()} •{' '}
                    {new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF' }).format(invoice.amount)}
                  </p>
                  <p
                    className={`text-xs font-medium ${
                      invoice.status === 'paid'
                        ? 'text-green-600'
                        : invoice.status === 'pending'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  >
                    Status: {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </p>
                </div>
                <button
                  onClick={() => downloadMutation.mutate(invoice.id)}
                  className="flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  disabled={downloadMutation.isPending}
                  aria-label={`Download invoice ${invoice.id}`}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </button>
              </motion.li>
            ))}
          </motion.ul>
        )}

        {/* Pagination */}
        {invoices.length > 0 && (
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setPage((prev) => prev + 1);
                refetchInvoices();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              disabled={invoicesLoading || invoices.length < 10}
              aria-label="Load more invoices"
            >
              Load More
            </button>
          </div>
        )}

        {/* Payment Methods */}
        <section className="mt-8 bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-blue-500" />
            Payment Methods
          </h3>
          {paymentMethods?.length ? (
            <ul className="space-y-3">
              {paymentMethods.map((method: PaymentMethod) => (
                <li key={method.id} className="p-3 bg-white rounded-md shadow-sm border border-gray-100">
                  <p className="text-sm text-gray-800">
                    {method.type === 'card' ? 'Credit Card' : 'Mobile Money'} ending in {method.lastFour}
                  </p>
                  {method.expiry && <p className="text-xs text-gray-500">Expires: {method.expiry}</p>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-600">No payment methods found.</p>
          )}
        </section>
      </motion.div>
    </ErrorBoundary>
  );
};

export default UserBilling;