import React, { useState, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { useForm, SubmitHandler } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { Ticket, Filter, X, Send, Eye } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import ErrorBoundary from '../ErrorBoundary';
import { setTickets } from '../../store/supportSlice';

interface Ticket {
  id: string;
  subject: string;
  status: 'open' | 'pending' | 'closed';
  date: string;
  description?: string;
}

interface FilterFormData {
  status: 'all' | 'open' | 'pending' | 'closed';
  search: string;
  dateFrom: string;
  dateTo: string;
}

interface NewTicketFormData {
  subject: string;
  description: string;
}

const fetchTickets = async (page: number, filters: FilterFormData) => {
  const params = new URLSearchParams({
    page: page.toString(),
    status: filters.status,
    search: filters.search,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
  });
  const response = await fetch(`/api/user/support/tickets?${params}`);
  if (!response.ok) throw new Error('Failed to fetch support tickets');
  return response.json();
};

const createTicket = async (data: NewTicketFormData) => {
  const response = await fetch('/api/user/support/tickets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create support ticket');
  return response.json();
};

const UserSupport: React.FC = () => {
  const { user } = useContext(AuthContext);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const tickets = useSelector((state: RootState) => state.support.tickets) as Ticket[];
  const [page, setPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const { register, handleSubmit, watch, reset } = useForm<FilterFormData>({
    defaultValues: {
      status: 'all',
      search: '',
      dateFrom: '',
      dateTo: '',
    },
  });

  const { register: registerNewTicket, handleSubmit: handleSubmitNewTicket, reset: resetNewTicket, formState: { errors: newTicketErrors } } = useForm<NewTicketFormData>({
    defaultValues: {
      subject: '',
      description: '',
    },
  });

  const filters = watch();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['tickets', page, filters],
    queryFn: () => fetchTickets(page, filters),
  });

  React.useEffect(() => {
    if (data) {
      dispatch(setTickets(data));
    }
  }, [data, dispatch]);

  const createTicketMutation = useMutation({
    mutationFn: createTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      resetNewTicket();
      setIsNewTicketOpen(false);
      toast.success('Support ticket created.', { theme: 'light' });
    },
    onError: () => {
      toast.error('Failed to create support ticket.', { theme: 'light' });
    },
  });

  const onFilterSubmit: SubmitHandler<FilterFormData> = () => {
    setPage(1);
    refetch();
  };

  const onNewTicketSubmit: SubmitHandler<NewTicketFormData> = (data) => {
    createTicketMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 bg-white shadow-lg rounded-xl max-w-3xl mx-auto"
      >
        <p className="text-sm text-gray-600 text-center">Loading support tickets...</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 bg-white shadow-lg rounded-xl max-w-3xl mx-auto"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Support</h2>
        <div className="text-center">
          <p className="text-sm text-red-600 mb-4">Error: {(error as Error)?.message}</p>
          <button
            onClick={() => refetch()}
            className="flex items-center mx-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            aria-label="Retry fetching support tickets"
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
        aria-label="Support"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Support</h2>
        <p className="text-sm text-gray-600 mb-6">Access support tickets, FAQs, and contact support.</p>

        {/* New Ticket Button */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Support Tickets</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
              aria-expanded={isFilterOpen}
              aria-controls="filter-panel"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
            <button
              onClick={() => setIsNewTicketOpen(true)}
              className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              aria-label="Create new support ticket"
            >
              <Send className="w-4 h-4 mr-2" />
              New Ticket
            </button>
          </div>
        </div>

        {/* Filter Panel */}
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
                    <option value="open">Open</option>
                    <option value="pending">Pending</option>
                    <option value="closed">Closed</option>
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
                    placeholder="Search tickets..."
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
                      refetch();
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

        {/* Tickets List */}
        {tickets.length === 0 ? (
          <p className="text-sm text-gray-600 text-center">No support tickets found.</p>
        ) : (
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            {tickets.map((ticket) => (
              <motion.li
                key={ticket.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 bg-white rounded-lg shadow-sm border flex items-center justify-between hover:bg-gray-50 transition-colors"
                role="article"
                aria-labelledby={`ticket-${ticket.id}`}
              >
                <div>
                  <p id={`ticket-${ticket.id}`} className="text-sm text-gray-800 font-semibold">
                    Ticket #{ticket.id}: {ticket.subject}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(ticket.date).toLocaleDateString()} •{' '}
                    <span
                      className={`font-medium ${
                        ticket.status === 'open'
                          ? 'text-blue-600'
                          : ticket.status === 'pending'
                          ? 'text-yellow-600'
                          : 'text-green-600'
                      }`}
                    >
                      Status: {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => setSelectedTicket(ticket)}
                  className="flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  aria-label={`View details for ticket ${ticket.id}`}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </button>
              </motion.li>
            ))}
          </motion.ul>
        )}

        {/* Pagination */}
        {tickets.length > 0 && (
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setPage((prev) => prev + 1);
                refetch();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              disabled={isLoading || tickets.length < 10}
              aria-label="Load more tickets"
            >
              Load More
            </button>
          </div>
        )}

        {/* New Ticket Form */}
        <AnimatePresence>
          {isNewTicketOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              role="dialog"
              aria-labelledby="new-ticket-title"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full"
              >
                <h3 id="new-ticket-title" className="text-lg font-semibold text-gray-800 mb-4">
                  Create New Support Ticket
                </h3>
                <form onSubmit={handleSubmitNewTicket(onNewTicketSubmit)} className="space-y-4">
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                      Subject
                    </label>
                    <input
                      id="subject"
                      {...registerNewTicket('subject', { required: 'Subject is required' })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                      aria-invalid={newTicketErrors.subject ? 'true' : 'false'}
                    />
                    {newTicketErrors.subject && <p className="mt-1 text-sm text-red-600">{newTicketErrors.subject.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      id="description"
                      {...registerNewTicket('description', { required: 'Description is required' })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                      rows={4}
                      aria-invalid={newTicketErrors.description ? 'true' : 'false'}
                    />
                    {newTicketErrors.description && <p className="mt-1 text-sm text-red-600">{newTicketErrors.description.message}</p>}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      disabled={createTicketMutation.isPending}
                      aria-label="Submit new ticket"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {createTicketMutation.isPending ? 'Submitting...' : 'Submit'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsNewTicketOpen(false)}
                      className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
                      aria-label="Cancel new ticket"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ticket Details Modal */}
        <AnimatePresence>
          {selectedTicket && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              role="dialog"
              aria-labelledby="ticket-details-title"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full"
              >
                <h3 id="ticket-details-title" className="text-lg font-semibold text-gray-800 mb-4">
                  Ticket #{selectedTicket.id}: {selectedTicket.subject}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Status:{' '}
                  <span
                    className={`font-medium ${
                      selectedTicket.status === 'open'
                        ? 'text-blue-600'
                        : selectedTicket.status === 'pending'
                        ? 'text-yellow-600'
                        : 'text-green-600'
                    }`}
                  >
                    {selectedTicket.status.charAt(0).toUpperCase() + selectedTicket.status.slice(1)}
                  </span>
                </p>
                <p className="text-sm text-gray-600 mb-2">Date: {new Date(selectedTicket.date).toLocaleDateString()}</p>
                <p className="text-sm text-gray-600 mb-4">{selectedTicket.description}</p>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
                  aria-label="Close ticket details"
                >
                  <X className="w-4 h-4 mr-2" />
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </ErrorBoundary>
  );
};

export default UserSupport;