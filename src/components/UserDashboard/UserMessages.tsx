import React, { useState, useContext, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { useForm, SubmitHandler } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { Mail, Send, Filter, X, Eye } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import ErrorBoundary from '../ErrorBoundary';
import { setMessages } from '../../store/messageSlice';

interface Message {
  id: string;
  from: string;
  subject: string;
  date: string;
  content: string;
  recipientType: 'admin' | 'support' | 'user';
}

interface FilterFormData {
  sender: string;
  subject: string;
  dateFrom: string;
  dateTo: string;
}

interface NewMessageFormData {
  recipientType: 'admin' | 'support';
  subject: string;
  content: string;
}

const fetchMessages = async (page: number, filters: FilterFormData) => {
  const params = new URLSearchParams({
    page: page.toString(),
    sender: filters.sender,
    subject: filters.subject,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
  });
  const response = await fetch(`/api/user/messages?${params}`);
  if (!response.ok) throw new Error('Failed to fetch messages');
  return response.json();
};

const sendMessage = async (data: NewMessageFormData) => {
  const response = await fetch('/api/user/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to send message');
  return response.json();
};

const UserMessages: React.FC = () => {
  const { user } = useContext(AuthContext);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const messages = useSelector((state: RootState) => state.message.messages) as Message[];
  const [page, setPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const { register, handleSubmit, watch, reset } = useForm<FilterFormData>({
    defaultValues: {
      sender: '',
      subject: '',
      dateFrom: '',
      dateTo: '',
    },
  });

  const { register: registerNewMessage, handleSubmit: handleSubmitNewMessage, reset: resetNewMessage, formState: { errors: newMessageErrors } } = useForm<NewMessageFormData>({
    defaultValues: {
      recipientType: 'support',
      subject: '',
      content: '',
    },
  });

  const filters = watch();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['messages', page, filters],
    queryFn: () => fetchMessages(page, filters),
  });

  useEffect(() => {
    if (data) {
      dispatch(setMessages(data));
    }
  }, [data, dispatch]);

  const sendMessageMutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      resetNewMessage();
      setIsNewMessageOpen(false);
      toast.success('Message sent successfully.', { theme: 'light' });
    },
    onError: () => {
      toast.error('Failed to send message.', { theme: 'light' });
    },
  });

  const onFilterSubmit: SubmitHandler<FilterFormData> = () => {
    setPage(1);
    refetch();
  };

  const onNewMessageSubmit: SubmitHandler<NewMessageFormData> = (data) => {
    sendMessageMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 bg-white shadow-lg rounded-xl max-w-3xl mx-auto"
      >
        <p className="text-sm text-gray-600 text-center">Loading messages...</p>
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
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Messages</h2>
        <div className="text-center">
          <p className="text-sm text-red-600 mb-4">Error: {(error as Error)?.message}</p>
          <button
            onClick={() => refetch()}
            className="flex items-center mx-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            aria-label="Retry fetching messages"
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
        aria-label="Messages"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Messages</h2>
        <p className="text-sm text-gray-600 mb-6">View and send messages to admin or support.</p>

        {/* New Message Button and Filters */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Messages</h3>
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
              onClick={() => setIsNewMessageOpen(true)}
              className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              aria-label="Send new message"
            >
              <Send className="w-4 h-4 mr-2" />
              New Message
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
                  <label htmlFor="sender" className="block text-sm font-medium text-gray-700">
                    Sender
                  </label>
                  <input
                    id="sender"
                    {...register('sender')}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Search by sender..."
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <input
                    id="subject"
                    {...register('subject')}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Search by subject..."
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

        {/* Messages List */}
        {messages.length === 0 ? (
          <p className="text-sm text-gray-600 text-center">No messages found.</p>
        ) : (
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            {messages.map((message) => (
              <motion.li
                key={message.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 bg-white rounded-lg shadow-sm border flex items-center justify-between hover:bg-gray-50 transition-colors"
                role="article"
                aria-labelledby={`message-${message.id}`}
              >
                <div>
                  <p id={`message-${message.id}`} className="text-sm text-gray-800 font-semibold">
                    From: {message.from}
                  </p>
                  <p className="text-sm text-gray-600">Subject: {message.subject}</p>
                  <p className="text-xs text-gray-500">{new Date(message.date).toLocaleString()}</p>
                </div>
                <button
                  onClick={() => setSelectedMessage(message)}
                  className="flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  aria-label={`View details for message ${message.id}`}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </button>
              </motion.li>
            ))}
          </motion.ul>
        )}

        {/* Pagination */}
        {messages.length > 0 && (
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setPage((prev) => prev + 1);
                refetch();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              disabled={isLoading || messages.length < 10}
              aria-label="Load more messages"
            >
              Load More
            </button>
          </div>
        )}

        {/* New Message Modal */}
        <AnimatePresence>
          {isNewMessageOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              role="dialog"
              aria-labelledby="new-message-title"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full"
              >
                <h3 id="new-message-title" className="text-lg font-semibold text-gray-800 mb-4">
                  Send New Message
                </h3>
                <form onSubmit={handleSubmitNewMessage(onNewMessageSubmit)} className="space-y-4">
                  <div>
                    <label htmlFor="recipientType" className="block text-sm font-medium text-gray-700">
                      Recipient
                    </label>
                    <select
                      id="recipientType"
                      {...registerNewMessage('recipientType', { required: 'Recipient is required' })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                      aria-invalid={newMessageErrors.recipientType ? 'true' : 'false'}
                    >
                      <option value="support">Support</option>
                      {user?.role === 'admin' && <option value="admin">Admin</option>}
                    </select>
                    {newMessageErrors.recipientType && <p className="mt-1 text-sm text-red-600">{newMessageErrors.recipientType.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                      Subject
                    </label>
                    <input
                      id="subject"
                      {...registerNewMessage('subject', { required: 'Subject is required' })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                      aria-invalid={newMessageErrors.subject ? 'true' : 'false'}
                    />
                    {newMessageErrors.subject && <p className="mt-1 text-sm text-red-600">{newMessageErrors.subject.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                      Message
                    </label>
                    <textarea
                      id="content"
                      {...registerNewMessage('content', { required: 'Message content is required' })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                      rows={4}
                      aria-invalid={newMessageErrors.content ? 'true' : 'false'}
                    />
                    {newMessageErrors.content && <p className="mt-1 text-sm text-red-600">{newMessageErrors.content.message}</p>}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      disabled={sendMessageMutation.isPending}
                      aria-label="Send message"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {sendMessageMutation.isPending ? 'Sending...' : 'Send'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsNewMessageOpen(false)}
                      className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
                      aria-label="Cancel new message"
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

        {/* Message Details Modal */}
        <AnimatePresence>
          {selectedMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              role="dialog"
              aria-labelledby="message-details-title"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full"
              >
                <h3 id="message-details-title" className="text-lg font-semibold text-gray-800 mb-4">
                  Message from {selectedMessage.from}
                </h3>
                <p className="text-sm text-gray-600 mb-2">Subject: {selectedMessage.subject}</p>
                <p className="text-sm text-gray-600 mb-2">Date: {new Date(selectedMessage.date).toLocaleString()}</p>
                <p className="text-sm text-gray-600 mb-4">{selectedMessage.content}</p>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
                  aria-label="Close message details"
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

export default UserMessages;