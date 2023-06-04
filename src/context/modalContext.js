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

  const value = {
    openModal,
    closeModal,
    onSubmit: modalOnSubmit,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
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
