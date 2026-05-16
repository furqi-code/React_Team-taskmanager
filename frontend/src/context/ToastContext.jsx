import React, { createContext, useState, useCallback } from 'react';
import Toast from '../components/Toast';

export const ToastContext = createContext({
  showToast: (msg, type) => {},
});

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToast({ id, message, type });
  }, []);

  const handleClose = () => setToast(null);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 pointer-events-none">
        {toast && (
          <div key={toast.id} className="pointer-events-auto flex justify-end">
            <Toast message={toast.message} type={toast.type} onClose={handleClose} />
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
};
