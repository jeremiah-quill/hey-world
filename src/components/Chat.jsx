import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { FaKey } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useUserSettings } from "@/context/userSettingsContext";

export function Chat({ openaiKey }) {
  // UI states
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isKeyViewOpen, setIsKeyViewOpen] = useState(false);
  const [isKeySecret, setIsKeySecret] = useState(true);
  // input states
  const [inputValue, setInputValue] = useState("");
  const [keyInputValue, setKeyInputValue] = useState(openaiKey || "");
  // data states
  const [key, setKey] = useState(openaiKey); // TODO: refactor this to use context
  const [messages, setMessages] = useState([]);
  // hooks
  const { data: session } = useSession();
  const { userSettings, toggleSetting } = useUserSettings();
  // refs
  const messagesEndRef = useRef(null);
  // handlers
  const toggleKeyView = () => {
    setIsKeyViewOpen(!isKeyViewOpen);
  };

  const handleKeyDown = (e, onKeyDown = () => {}) => {
    if (e.key === "Enter" && !e.shiftKey) {
      onKeyDown();
    }
  };

  const handleSendMessage = async () => {
    setIsLoading(true);
    if (inputValue.trim() === "") return;

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

  const handleSubmitKey = () => {
    localStorage.setItem("openai-key", keyInputValue);
    setKey(keyInputValue);
    setIsKeyViewOpen(false);
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

  const handleUserKeyToggle = () => {
    toggleSetting("isUseUserKeyEnabled");
  };

  // effects
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (error) return <ChatError resetChat={resetChat} error={error} />;

  return (
    <div className="flex h-full flex-col bg-slate-100 p-4">
      {session && (
        <div className="mb-4 flex items-center space-x-2">
          <input
            id="usePersonalApiKey"
            type="checkbox"
            checked={userSettings.isUseUserKeyEnabled}
            onChange={handleUserKeyToggle}
            className="form-checkbox h-4 w-4 rounded text-blue-500 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
          />
          <label htmlFor="usePersonalApiKey" className="text-gray-600">
            Use personal API key instead of free rate limited key
          </label>
        </div>
      )}
      <div className="relative flex max-h-full flex-1 flex-col overflow-y-scroll rounded-lg bg-white  p-4 shadow-md">
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
                <ReactMarkdown className="prose">{msg.content}</ReactMarkdown>
              </div>
            </li>
          ))}
          <div ref={messagesEndRef} />
        </ul>
      </div>
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
          <>
            <button
              onClick={() => toggleKeyView()}
              className="rounded-l-lg bg-[#4CAF50] p-2 font-bold text-white"
            >
              <FaKey />
            </button>
            {isKeyViewOpen ? (
              <div className="flex w-full">
                <button
                  className="border border-slate-300 bg-white p-2 outline-none"
                  onClick={() => setIsKeySecret(!isKeySecret)}
                >
                  {isKeySecret ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                </button>
                <input
                  type={isKeySecret ? "password" : "text"}
                  className="flex-1 border border-x-0 border-slate-300 p-2 outline-none"
                  placeholder="Enter your key..."
                  value={keyInputValue}
                  onChange={(e) => setKeyInputValue(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, handleSubmitKey)}
                />
              </div>
            ) : (
              <textarea
                rows="1"
                type="text"
                className="h-auto flex-1 resize-none overflow-auto border border-slate-300 p-2 outline-none"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  handleInputHeight(e);
                }}
                onKeyDown={(e) => handleKeyDown(e, handleSendMessage)}
              />
            )}
            <button
              className="rounded-r-lg bg-[#4CAF50] p-2 font-bold text-white"
              onClick={isKeyViewOpen ? handleSubmitKey : handleSendMessage}
            >
              {isKeyViewOpen ? "Save" : "Send"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const ChatError = ({ resetChat, error }) => {
  return (
    <div className="dark:gray-text-300 absolute inset-0 grid place-items-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800 dark:text-gray-300">
        <h2 className="dark:gray-text-300 mb-4 text-2xl font-semibold text-slate-900">
          😢 It looks like something went wrong:
        </h2>
        <p className="mb-6">{error}</p>
        <button
          onClick={resetChat}
          className="mb-4 rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
        >
          Back
        </button>
        <div className="text-gray-600">
          If you're still stuck, please contact{" "}
          <a
            href="mailto:jcq5010@gmail.com"
            className="text-blue-500 hover:text-blue-700"
          >
            jcq5010@gmail.com
          </a>{" "}
          or{" "}
          <Link
            href="/bug-report"
            className="text-blue-500 hover:text-blue-700"
          >
            file a bug report.
          </Link>{" "}
          Sorry again!
        </div>
      </div>
    </div>
  );
};
