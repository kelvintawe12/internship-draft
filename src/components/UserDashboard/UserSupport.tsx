import React, { useEffect, useState } from 'react';
import ErrorBoundary from '../ErrorBoundary';

interface Ticket {
  id: number;
  subject: string;
  status: string;
  date: string;
}

const UserSupport: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    const fetchSupportTickets = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/user/support/tickets');
        if (!response.ok) throw new Error('Failed to fetch support tickets');
        const data: Ticket[] = await response.json();
        setTickets(data);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchSupportTickets();
  }, []);

  if (loading) {
    return <p className="text-xs text-gray-600 p-4">Loading support tickets...</p>;
  }

  if (error) {
    return <p className="text-xs text-red-500 p-4">Error: {error}</p>;
  }

  return (
    <ErrorBoundary>
      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-4">Support</h2>
        <p>Access support tickets, FAQs, and contact support.</p>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Support Tickets</h3>
          {tickets.length === 0 ? (
            <p className="text-xs text-gray-600">No support tickets found.</p>
          ) : (
            <ul className="space-y-2">
              {tickets.map((ticket) => (
                <li key={ticket.id} className="p-3 bg-gray-50 rounded-lg text-xs">
                  <p className="text-gray-800">Ticket #{ticket.id}: {ticket.subject}</p>
                  <p className="text-gray-500">
                    Status: {ticket.status} • Date: {ticket.date}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default UserSupport;
