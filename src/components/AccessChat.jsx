import { useState, useRef } from "react";

import { useModal } from "@/context/modalContext";
import { signIn } from "next-auth/react";
import { ChatError } from "@/components/ChatError";
import { useUserSettings } from "@/context/userSettingsContext";
import { useToast } from "@/context/toastContext";

// TODO: extract logic to custom hook
export function AccessChat() {
  // state
  const { openModal, closeModal } = useModal();
  const showToast = useToast();
  const { syncKey } = useUserSettings();
  const [error, setError] = useState(null);

  // refs
  const formRef = useRef(null);

  // handlers
  const handleApiKeySubmit = async () => {
    const key = formRef.current.value;

    if (key === "") {
      showToast("Please enter a key", "bg-red-500", "text-white");
      return;
    }

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
      showToast("Please enter a valid key", "bg-red-500", "text-white");
      return;
    }

    // set key in state
    syncKey(key);
    showToast("API key saved", "bg-green", "text-white");

    // close modal
    closeModal();
  };

  const reset = () => {
    setError(null);
  };

  if (error) return <ChatError error={error} onBack={reset} />;

  return (
    <>
      <div className="flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white p-6 dark:bg-slate-800 dark:text-slate-300">
          <h2 className="mb-4 text-2xl font-semibold">
            Chat with an AI assistant
          </h2>
          <p className="mb-6">
            Chat with an AI assistant to help you with web design and
            development tasks.
          </p>
          <p className="mb-2">To access the chatbot, you can:</p>
          <div className="flex justify-between">
            <button
              onClick={signIn}
              className="rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
            >
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
              className="hover:bg-green-700 focus:ring-green-400 rounded bg-green px-4 py-2 font-semibold text-white focus:outline-none focus:ring-2 focus:ring-opacity-50"
            >
              Add private OpenAI key
            </button>
          </div>
        </div>
      </div>
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
      className="w-full flex-1 rounded-lg border border-slate-300 p-2 font-normal outline-none dark:border-slate-500 dark:bg-slate-800"
      placeholder="Enter your OpenAI API key"
      value={inputValue}
      onChange={handleChange}
    />
  );
};
