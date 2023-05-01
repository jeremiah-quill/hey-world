import { useState, useRef } from "react";
import useModal from "@/hooks/useModal";
import { Modal } from "@/components/Modal";
import { signIn } from "next-auth/react";
import Link from "next/link";

export function AccessChat({ setOpenaiKey }) {
  const { modalIsOpen, modalContent, modalTitle, modalOnSubmit, openModal, closeModal } = useModal();

  const [error, setError] = useState(null);

  const formRef = useRef(null);

  const handleApiKeySubmit = async () => {
    const key = formRef.current.value;

    // test api key to make sure it's valid:
    const response = await fetch("/api/openai-test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ key }),
    });

    const data = await response.json();

    if (data.error) {
      setError(data.error);
      return;
    }

    // set key in state
    setOpenaiKey(key);

    // sync with local storage
    localStorage.setItem("openai-key", key);

    // TODO: why is this not working? I needed it at one point but now I don't?
    // reset form
    // formRef.current.value = "";

    // close modal
    closeModal();
  };

  const reset = () => {
    setError(null);
  };

  if (error) {
    return (
      <div className="bg-gray-100 absolute inset-0 grid place-items-center">
        <div className="bg-white p-6 rounded-lg w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-4 text-slate-900">😢 It looks like something went wrong:</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={reset}
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded mb-4 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50">
            Back
          </button>
          <div className="text-gray-600">
            If you're still stuck, please contact{" "}
            <a href="mailto:jcq5010@gmail.com" className="text-blue-500 hover:text-blue-700">
              jcq5010@gmail.com
            </a>{" "}
            or{" "}
            <Link href="/bug-report" className="text-blue-500 hover:text-blue-700">
              file a bug report.
            </Link>{" "}
            Sorry again!
          </div>
        </div>
      </div>
    );
  }

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
              onClick={signIn}
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
              className="bg-green text-white font-semibold py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50">
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
