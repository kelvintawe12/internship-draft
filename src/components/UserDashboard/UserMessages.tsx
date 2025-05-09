import React, { useEffect, useState } from 'react';
import ErrorBoundary from '../ErrorBoundary';

interface Message {
  id: number;
  from: string;
  subject: string;
  date: string;
}

const UserMessages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/user/messages');
        if (!response.ok) throw new Error('Failed to fetch messages');
        const data: Message[] = await response.json();
        setMessages(data);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  if (loading) {
    return <p className="text-xs text-gray-600 p-4">Loading messages...</p>;
  }

  if (error) {
    return <p className="text-xs text-red-500 p-4">Error: {error}</p>;
  }

  if (messages.length === 0) {
    return <p className="text-xs text-gray-600 p-4">No messages.</p>;
  }

  return (
    <ErrorBoundary>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Messages</h2>
        <ul className="space-y-3">
          {messages.map((msg) => (
            <li key={msg.id} className="p-4 bg-white rounded shadow">
              <p><strong>From:</strong> {msg.from}</p>
              <p><strong>Subject:</strong> {msg.subject}</p>
              <small className="text-gray-500">{new Date(msg.date).toLocaleDateString()}</small>
            </li>
          ))}
        </ul>
      </div>
    </ErrorBoundary>
  );
};

export default UserMessages;
