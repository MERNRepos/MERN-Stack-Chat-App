import React, { createContext, useContext, useState } from 'react';

const ToastContext = createContext();

let toastId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = toastId++;
    const newToast = { id, message, type };
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const removeToast = id => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <span>{toast.message}</span>
            <button className="toast-close" onClick={() => removeToast(toast.id)}>✖</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  return useContext(ToastContext);
};
