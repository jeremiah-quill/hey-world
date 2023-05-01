import { useState } from "react";

const useModal = () => {
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

  return {
    modalIsOpen,
    modalContent,
    modalTitle,
    modalOnSubmit,
    openModal,
    closeModal,
  };
};

export default useModal;
