import React, { useEffect } from 'react';

export default function Toast({ message, type = 'info', onClose }) {
  // Auto dismiss after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgClass = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-gray-800',
  }[type];

  return (
    <div className={`animate-slide-in-right text-white px-4 py-2 rounded-md shadow-sm text-sm font-medium ${bgClass} transition-all`}>
      {message}
    </div>
  );
}
