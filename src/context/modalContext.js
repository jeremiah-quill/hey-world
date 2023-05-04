import React, { createContext, useContext, useState, useCallback } from "react";
import { Modal } from "@/components/Modal";

const ModalContext = createContext();

export const useModal = () => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }

  return context;
};

export const ModalProvider = ({ children }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState("");
  const [modalOnSubmit, setModalOnSubmit] = useState(() => {});

  const openModal = ({ content, title, onSubmit }) => {
    setModalContent(content);
    setModalTitle(title);
    setModalOnSubmit(() => onSubmit);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };
  // const [modals, setModals] = useState([]);
  // const duration = 3000;

  // const addToast = useCallback((message, bgColor, textColor) => {
  //   const id = new Date().getTime();

  //   setToasts((prevToasts) => [
  //     ...prevToasts,
  //     { id, message, bgColor, textColor },
  //   ]);

  //   setTimeout(() => {
  //     setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  //   }, duration);
  // }, []);

  const value = {
    openModal,
    closeModal,
    onSubmit: modalOnSubmit,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      {/* <div className="fixed bottom-4 right-4 z-[10000] space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-lg border px-6 py-3 transition-all duration-300 ease-in-out ${toast.bgColor} ${toast.textColor}`}
          >
            {toast.message}
          </div>
        ))}
      </div> */}

      <Modal
        className="fixed"
        isOpen={modalIsOpen}
        onClose={closeModal}
        title={modalTitle}
        onSubmit={modalOnSubmit}
        modalContent={modalContent}
      />
    </ModalContext.Provider>
  );
};
