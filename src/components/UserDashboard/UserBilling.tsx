import React, { useEffect, useState } from 'react';
import ErrorBoundary from '../ErrorBoundary';

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: string;
}

const UserBilling: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    const fetchBillingInfo = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/user/billing');
        if (!response.ok) throw new Error('Failed to fetch billing information');
        const data: Invoice[] = await response.json();
        setInvoices(data);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchBillingInfo();
  }, []);

  if (loading) {
    return <p className="text-xs text-gray-600 p-4">Loading billing information...</p>;
  }

  if (error) {
    return <p className="text-xs text-red-500 p-4">Error: {error}</p>;
  }

  return (
    <ErrorBoundary>
      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-4">Billing Information</h2>
        <p>View and manage your billing details, payment methods, and invoices.</p>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Invoices</h3>
          {invoices.length === 0 ? (
            <p className="text-xs text-gray-600">No invoices found.</p>
          ) : (
            <ul className="space-y-2">
              {invoices.map((invoice) => (
                <li key={invoice.id} className="p-3 bg-gray-50 rounded-lg text-xs">
                  <p className="text-gray-800">Invoice #{invoice.id}</p>
                  <p className="text-gray-500">
                    {invoice.date} • Amount: RWF {invoice.amount} • Status: {invoice.status}
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

export default UserBilling;
