import { useState, useRef } from "react";
import useModal from "@/hooks/useModal";
import { Modal } from "@/components/Modal";

export function AccessChat({ setOpenaiKey }) {
  const { modalIsOpen, modalContent, modalTitle, modalOnSubmit, openModal, closeModal } = useModal();

  const formRef = useRef(null);

  const handleSignUpSubmit = () => {
    // TODO: sign up logic here
    closeModal();
  };

  const handleApiKeySubmit = () => {
    const key = formRef.current.value;

    // set key in state
    setOpenaiKey(key);

    // sync with local storage
    localStorage.setItem("openai-key", key);

    // reset form
    formRef.current.value = "";

    // close modal
    closeModal();
  };

  return (
    <>
      <div className="bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-4">Chat with an AI assistant</h2>
          <p className="text-gray-600 mb-6">
            Chat with an AI assistant to help you with web design and development tasks.
          </p>
          <p className="text-gray-600 mb-2">To access the chatbot, you can:</p>
          <div className="flex justify-between">
            <button
              onClick={() => openModal({ content: "test sign up ", title: "Sign Up", onSubmit: handleSignUpSubmit })}
              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50">
              Sign up for free (rate limited)
            </button>
            <button
              onClick={() =>
                openModal({
                  content: <GptKeyInput formRef={formRef} />,
                  title: "Add Private OpenAI Key",
                  onSubmit: handleApiKeySubmit,
                })
              }
              className="bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50">
              Add private OpenAI key
            </button>
          </div>
        </div>
      </div>
      <Modal isOpen={modalIsOpen} onClose={closeModal} title={modalTitle} onSubmit={modalOnSubmit}>
        {modalContent}
      </Modal>
    </>
  );
}

const GptKeyInput = ({ formRef }) => {
  const [inputValue, setInputValue] = useState("");

  function handleChange(e) {
    setInputValue(e.target.value);
  }

  return (
    <input
      ref={formRef}
      type="text"
      className="flex-1 w-full p-2 rounded-lg border border-slate-300 outline-none font-normal"
      placeholder="Enter your OpenAI API key"
      value={inputValue}
      onChange={handleChange}
    />
  );
};
