import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { FaKey } from "react-icons/fa";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useUserSettings } from "@/context/userSettingsContext";
import { ChatError } from "@/components/ChatError";
import useModal from "@/hooks/useModal";
import { Modal } from "@/components/Modal";
import { useToast } from "@/context/toastContext";

export function Chat({ isChatOpen }) {
  // UI states
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const {
    modalIsOpen,
    modalContent,
    modalTitle,
    modalOnSubmit,
    openModal,
    closeModal,
  } = useModal();

  // data
  const { data: session } = useSession();
  const { userSettings, toggleSetting, key, setKey } = useUserSettings();
  const [messages, setMessages] = useState([]);

  // refs
  const messagesEndRef = useRef(null);
  const formRef = useRef(null);

  // handlers
  const handleKeyDown = (e, onKeyDown = () => {}) => {
    if (e.key === "Enter" && !e.shiftKey) {
      onKeyDown();
    }
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    setIsLoading(true);

    setInputValue("");

    const newMessages = [...messages, { role: "user", content: inputValue }];
    setMessages(newMessages);

    const response = await fetch("/api/gpt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversation: newMessages,
        key: key,
        useUserKey: userSettings.isUseUserKeyEnabled,
      }),
    });

    const data = await response.json();

    if (data.error) {
      setError(data.error);
      return;
    }

    setMessages([
      ...newMessages,
      { role: "assistant", content: data.choices[0].message.content },
    ]);
    setIsLoading(false);
  };

  const handleInputHeight = (e) => {
    if (e.target.scrollHeight > 200) return;
    e.target.style.height = "auto"; // Reset the height to "auto" before calculating the new height
    e.target.style.height = `${e.target.scrollHeight}px`; // Set the height to match the scroll height
  };

  const resetChat = () => {
    setMessages((prevMessages) =>
      prevMessages.filter((msg, idx) => idx !== prevMessages.length - 1)
    );
    setIsLoading(false);
    setError(null);
  };

  // effects
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (error) return <ChatError onBack={resetChat} error={error} />;

  return (
    <>
      <div className="flex h-full flex-col rounded-lg border bg-slate-100 p-4 text-slate-800  dark:border-slate-500 dark:bg-slate-800 dark:text-slate-300">
        {isChatOpen && (
          <div className="relative flex max-h-full flex-1 flex-col overflow-y-scroll rounded-lg bg-white p-4 shadow-md dark:bg-slate-700">
            <ul className="mt-auto grid gap-2 text-base">
              {messages.map((msg, index) => (
                <li
                  key={index}
                  className={`flex items-center gap-2 rounded-lg p-2 ${
                    msg.role === "user"
                      ? "ml-auto max-w-[75%] bg-slate-200"
                      : "mr-auto max-w-[75%] bg-slate-800 text-white"
                  }`}
                >
                  <div className={` ${msg.role !== "user" && "bot"}`}>
                    <ReactMarkdown className="prose">
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </li>
              ))}
              <div ref={messagesEndRef} />
            </ul>
          </div>
        )}

        <div className="mt-4 flex w-full justify-center text-base">
          {isLoading ? (
            <div
              className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status"
            >
              <span className="absolute -m-px h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
          ) : (
            <div className="flex w-full overflow-hidden rounded-lg border dark:border-slate-500">
              <button
                onClick={() =>
                  openModal({
                    title: "API Key",
                    content: <ChatSettingsModal onClose={closeModal} />,
                  })
                }
                className=" bg-slate-200 p-2 font-bold text-slate-800 dark:bg-slate-700 dark:text-slate-300"
              >
                <FaKey />
              </button>
              <textarea
                rows="1"
                type="text"
                className="h-auto flex-1 resize-none overflow-auto  bg-white p-2 text-slate-800 outline-none dark:bg-slate-800 dark:text-slate-300"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  handleInputHeight(e);
                }}
                onKeyDown={(e) => handleKeyDown(e, handleSendMessage)}
              />
              <button
                className="bg-slate-200 p-2 text-slate-800 dark:bg-slate-700 dark:text-slate-300"
                onClick={handleSendMessage}
              >
                Send
              </button>
            </div>
          )}
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onClose={closeModal}
        title={modalTitle}
        onSubmit={modalOnSubmit}
      >
        {modalContent}
      </Modal>
    </>
  );
}

const ChatSettingsModal = ({ onClose }) => {
  // state
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const { userSettings, toggleSetting, key, syncKey } = useUserSettings();
  const [inputValue, setInputValue] = useState(key || "");
  const [selectedOption, setSelectedOption] = useState(
    !session ? "user" : userSettings.isUseUserKeyEnabled ? "user" : "free"
  );

  const showToast = useToast();

  // handlers
  function handleChange(e) {
    setInputValue(e.target.value);
  }
  const handleClick = (option) => {
    setSelectedOption(option);
  };
  async function handleSubmit(e) {
    setLoading(true);
    e.preventDefault();

    // submit free selection
    if (selectedOption === "free") {
      toggleSetting("isUseUserKeyEnabled", false);
      setLoading(false);
      showToast("Free API key selected", "bg-green");
      onClose();
      return;
    }

    // submit user selection
    if (selectedOption === "user") {
      if (inputValue === "") {
        setLoading(false);
        showToast("Please enter a key", "bg-red-500");
        return;
      }

      const response = await fetch("/api/openai-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key: inputValue }),
      });

      const data = await response.json();

      if (data.error) {
        setLoading(false);
        showToast("Please enter a valid key", "bg-red-500");
        return;
      }

      syncKey(inputValue);
      toggleSetting("isUseUserKeyEnabled", true);
      setLoading(false);
      showToast("Key entered successfully", "bg-green", "text-white");
      onClose();
    }
  }

  const handleRemoveKey = () => {
    syncKey("");
    setSelectedOption("free");
    toggleSetting("isUseUserKeyEnabled", false);
    showToast("Key removed successfully", "bg-green", "text-white");
  };

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div
          className={`${
            selectedOption === "free"
              ? "border-2 border-blue-500"
              : "border border-gray-300"
          } cursor-pointer rounded p-4`}
          onClick={() => session && handleClick("free")}
        >
          <div className={`${!session ? "opacity-50" : "opacity-100"}`}>
            <div className="mb-4 flex items-center">
              <input
                type="radio"
                id="free"
                name="key"
                checked={selectedOption === "free"}
                onChange={() => handleClick("free")}
                className="mr-2"
                disabled={!session}
              />
              <label htmlFor="free" className="font-bold">
                Use Free Key
              </label>
            </div>
            <p className="text-sm">
              The free key has a rate limit of 1 message per 10 seconds.
            </p>
          </div>
          {!session && (
            <button
              className="mt-2 rounded bg-blue-500 px-4 py-2 text-white"
              onClick={signIn}
            >
              Sign Up/Login
            </button>
          )}
        </div>

        <div
          className={`${
            selectedOption === "user"
              ? "border-2 border-blue-500"
              : "border border-gray-300"
          } cursor-pointer rounded p-4`}
          onClick={() => handleClick("user")}
        >
          <div className="mb-4 flex items-center">
            <input
              required="true"
              type="radio"
              id="user"
              name="key"
              checked={selectedOption === "user"}
              onChange={() => handleClick("user")}
              className="mr-2"
            />
            <label htmlFor="user" className="font-bold">
              Use your own key
            </label>
          </div>
          <p className="mb-4 text-sm">
            You can get an API key{" "}
            <a
              href="https://beta.openai.com/account/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              here
            </a>
            .
          </p>
          <p className="text-sm">
            <strong>NOTE:</strong>{" "}
            {!session
              ? "This key will expire when you close the browser. If you want to save your key or use ours for free, please sign up/login."
              : "This key is stored in your browser and is only sent to OpenAI's API."}
          </p>
          {selectedOption === "user" && (
            <div className="mt-4 flex flex-col gap-2">
              <label htmlFor="key" className="text-sm">
                API Key
              </label>
              <input
                type="text"
                className="w-full flex-1 rounded-lg border border-slate-300 p-2 font-normal outline-none dark:border-slate-500 dark:bg-slate-800"
                placeholder="Enter your OpenAI API key"
                value={inputValue}
                onChange={handleChange}
              />
            </div>
          )}
        </div>
        <div className="mt-4 flex justify-end gap-4">
          {session && userSettings.isUseUserKeyEnabled && (
            <button
              className="mr-auto rounded bg-gray-300 px-4 py-2 text-black"
              onClick={handleRemoveKey}
            >
              Remove key from local storage
            </button>
          )}
          <button
            className="rounded bg-gray-300 px-4 py-2 text-black"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded bg-blue-500 px-4 py-2 text-white"
          >
            {loading ? "...loading" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

{
  /* <div
className={`${
  selectedOption === "free"
    ? "border-2 border-blue-500"
    : "border border-gray-300"
} cursor-pointer rounded p-4 ${
  !session ? "opacity-50" : "opacity-100"
}`}
onClick={() => session && handleClick("free")}
>
<div className="mb-4 flex">
  <input
    type="radio"
    id="free"
    name="key"
    checked={selectedOption === "free"}
    onChange={() => handleClick("free")}
    className="mr-2"
    disabled={!session}
  />
  <label htmlFor="free" className="font-bold">
    Use free key
  </label>
</div>
<p className="text-sm">
  The free key has a rate limit of 1 message per 10 seconds.
</p>
{!session && (
  <button
    className="mt-2 rounded bg-blue-500 px-4 py-2 text-white"
    onClick={signIn}
  >
    Sign Up/Login
  </button>
)}
</div> */
}
