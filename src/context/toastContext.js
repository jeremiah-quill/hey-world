import React, { createContext, useContext, useState, useCallback } from "react";
import { motion } from "framer-motion";

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const duration = 3000;

  const addToast = useCallback((message, bgColor, textColor) => {
    const id = new Date().getTime();

    setToasts((prevToasts) => [
      ...prevToasts,
      { id, message, bgColor, textColor },
    ]);

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed bottom-4 right-4 z-[10000] space-y-2">
        {toasts.map((toast) => (
          <div key={toast.id} className="relative">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`rounded-lg border px-6 py-3 transition-all duration-300 ease-in-out ${toast.bgColor} ${toast.textColor}`}
            >
              {toast.message}
            </motion.div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
