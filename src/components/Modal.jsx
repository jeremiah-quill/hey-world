import React from "react";

export const Modal = ({ isOpen, onClose, onSubmit = null, title = null, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative z-20">
          {title && <h2 className="text-2xl font-semibold mb-4">{title}</h2>}
          {children}
          {onSubmit && (
            <div className="flex justify-end mt-6">
              <button
                className="bg-gray-300 text-black font-semibold py-2 px-4 rounded mr-2 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50"
                onClick={onClose}>
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                onClick={() => onSubmit()}>
                Submit
              </button>
            </div>
          )}
        </div>
      </div>
      <div onClick={onClose} className="fixed inset-0 bg-gray-800 opacity-75" />
    </div>
  );
};
