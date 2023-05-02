import React from "react";

export const Modal = ({
  isOpen,
  onClose,
  onSubmit = null,
  title = null,
  children,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[1000] overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="relative z-20 w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-slate-800 dark:text-slate-300">
          {title && <h2 className="mb-4 text-2xl font-semibold">{title}</h2>}
          {children}
          {onSubmit && (
            <div className="mt-6 flex justify-end">
              <button
                className="mr-2 rounded bg-gray-300 px-4 py-2 font-semibold text-black hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                onClick={() => onSubmit()}
              >
                Submit
              </button>
            </div>
          )}
        </div>
      </div>
      <div
        onClick={onClose}
        className="fixed inset-0 backdrop-blur backdrop-brightness-75"
      />
    </div>
  );
};
