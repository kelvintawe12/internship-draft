import React from 'react';

interface SpinnerProps {
  loading?: boolean;
  variant?: 'inline' | 'fullscreen';
}

const Spinner: React.FC<SpinnerProps> = ({ loading = true, variant = 'inline' }) => {
  if (!loading) return null;

  const baseSpinner = (
    <div
      className="w-6 h-6 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"
      role="status"
      aria-label="Loading"
    ></div>
  );

  if (variant === 'fullscreen') {
    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
        {baseSpinner}
      </div>
    );
  }

  return <div className="flex items-center justify-center">{baseSpinner}</div>;
};

export default Spinner;