import React, { useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { signIn, useSession } from "next-auth/react";
import { useUserSettings } from "@/context/userSettingsContext";
import { ChatError } from "@/components/ChatError";
import { useChat } from "@/hooks/useChat";
import { useChatSettings } from "@/hooks/useChatSettings";
import { useModal } from "@/context/modalContext";
import Draggable from "react-draggable";
import { motion } from "framer-motion";
import { AccessChat } from "@/components/AccessChat";
import { BsArrowsAngleExpand, BsArrowsAngleContract } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import { VscChromeClose } from "react-icons/vsc";

export function Chat({ messages, setMessages, setIsChatOpen, isChatOpen }) {
  // chat state, handlers, and effects
  const initialPosition = { x: 0, y: 0 };
  const [isPopped, setIsPopped] = React.useState(false);
  const { data: session } = useSession();
  const { key } = useUserSettings();
  const { openModal, closeModal } = useModal();
  const {
    inputValue,
    handleChatInputChange,
    handleKeyDown,
    isLoading,
    error,
    sendMessage,
    resetChat,
  } = useChat({ messages, setMessages });

  // refs
  const messagesEndRef = useRef(null);

  // effects
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Draggable disabled={!isPopped} position={!isPopped && initialPosition}>
      <motion.div
        className={`${
          isPopped
            ? "absolute bottom-[65px] right-[20px] h-[500px] w-[500px]"
            : "relative h-[50%]"
        } z-[1000] flex transform flex-col rounded-lg border bg-slate-100 text-slate-800  dark:border-slate-500  dark:bg-slate-800 dark:text-slate-300`}
      >
        <>
          {!key && !session ? (
            <div className="absolute inset-0 grid place-items-center">
              <AccessChat />
            </div>
          ) : (
            <>
              <div className="flex w-full justify-end gap-4 border-b p-2 dark:border-slate-500">
                <button
                  className="transition-all hover:text-blue-500"
                  onClick={() => {
                    openModal({
                      title: "API Key",
                      content: <ChatSettingsModal onClose={closeModal} />,
                    });
                  }}
                >
                  <IoSettingsOutline className="text-2xl" />
                </button>
                <button
                  className="transition-all hover:text-blue-500"
                  onClick={() => {
                    setIsPopped(!isPopped);
                  }}
                >
                  {isPopped ? (
                    <BsArrowsAngleContract className="text-2xl" />
                  ) : (
                    <BsArrowsAngleExpand className="text-2xl" />
                  )}
                </button>
                <button
                  className="transition-all hover:text-blue-500"
                  onClick={() => {
                    setIsChatOpen(!isChatOpen);
                  }}
                >
                  <VscChromeClose className="text-2xl transition-all hover:text-blue-500" />
                </button>
              </div>
              {/* chat container */}
              <div className="relative flex max-h-full flex-1 flex-col overflow-y-scroll bg-white p-4  dark:bg-slate-700">
                <ChatMessageList
                  messages={messages}
                  error={error}
                  resetChat={resetChat}
                />
              </div>
              {/* message bar */}
              <div className="flex w-full justify-center text-base">
                <ChatInput
                  isLoading={isLoading}
                  sendMessage={sendMessage}
                  inputValue={inputValue}
                  handleKeyDown={handleKeyDown}
                  handleChatInputChange={handleChatInputChange}
                />
              </div>
            </>
          )}
        </>
      </motion.div>
    </Draggable>
  );
}

const ChatMessageList = ({ messages, messagesEndRef, error, resetChat }) => {
  if (error) return <ChatError onBack={resetChat} error={error} />;

  return (
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
  );
};

const ChatLoader = () => {
  return (
    <div
      className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
      role="status"
    >
      <span className="absolute -m-px h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );
};

const ChatInput = ({
  inputValue,
  handleChatInputChange,
  sendMessage,
  handleKeyDown,
  isLoading,
}) => {
  const { openModal, closeModal } = useModal();

  if (isLoading) return <ChatLoader />;

  return (
    <div className="border-b-lg flex w-full overflow-hidden rounded-b-lg border-t dark:border-slate-500">
      <textarea
        rows="1"
        type="text"
        className="h-auto flex-1 resize-none overflow-auto bg-white p-2 text-slate-800 outline-none dark:bg-slate-800 dark:text-slate-300"
        placeholder="Type your message..."
        value={inputValue}
        onChange={(e) => {
          handleChatInputChange(e);
        }}
        onKeyDown={(e) => handleKeyDown(e, sendMessage)}
      />
      <button
        className="bg-slate-200 p-2 text-slate-800 dark:bg-slate-700 dark:text-slate-300"
        onClick={sendMessage}
      >
        Send
      </button>
    </div>
  );
};

const ChatSettingsModal = ({ onClose }) => {
  // state
  const { data: session } = useSession();
  const { key } = useUserSettings();

  const {
    loading,
    inputValue,
    handleChange,
    handleClick,
    handleSubmit,
    handleRemoveKey,
    selectedOption,
  } = useChatSettings({ onClose });

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
            <div className="flex items-center">
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
            <p className="my-4 text-sm">
              Please note the free key is limited to a few messages at a time.
              You may have to wait a few seconds between messages.
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
            <strong>NOTE:</strong>This key is stored in your browser and is only
            sent to OpenAI's API.
          </p>
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
        </div>
        <div className="mt-4 flex justify-end gap-4">
          {key && (
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
