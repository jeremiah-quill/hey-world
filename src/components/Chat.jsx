import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { FaKey } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Link from "next/link";

export function Chat({ openaiKey }) {
  const [error, setError] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [key, setKey] = useState(openaiKey);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isKeyViewOpen, setIsKeyViewOpen] = useState(false);
  const [keyInputValue, setKeyInputValue] = useState(openaiKey || "");
  const [isKeySecret, setIsKeySecret] = useState(true);

  const messagesEndRef = useRef(null);

  const toggleKeyView = () => {
    setIsKeyViewOpen(!isKeyViewOpen);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

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
      body: JSON.stringify({ conversation: newMessages, key: key }),
    });

    const data = await response.json();

    if (data.error) {
      setError(data.error);
      return;
    }

    setMessages([...newMessages, { role: "assistant", content: data.choices[0].message.content }]);
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
    setMessages((prevMessages) => prevMessages.filter((msg, idx) => idx !== prevMessages.length - 1));
    setIsLoading(false);
    setError(null);
  };

  if (error) {
    return (
      <div className="bg-gray-100 absolute inset-0 grid place-items-center">
        <div className="bg-white p-6 rounded-lg w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-4 text-slate-900">😢 It looks like something went wrong:</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={resetChat}
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
    <div className="flex flex-col h-full bg-slate-100 p-4">
      <div className="relative flex-1 flex flex-col bg-white shadow-md rounded-lg p-4 max-h-full overflow-y-scroll">
        <ul className="mt-auto grid gap-2 text-base">
          {messages.map((msg, index) => (
            <li
              key={index}
              className={`flex items-center p-2 rounded-lg gap-2 ${
                msg.role === "user" ? "bg-slate-200 ml-auto max-w-[75%]" : "bg-slate-800 text-white mr-auto max-w-[75%]"
              }`}>
              <div className={` ${msg.role !== "user" && "bot"}`}>
                <ReactMarkdown className="prose">{msg.content}</ReactMarkdown>
              </div>
            </li>
          ))}
          <div ref={messagesEndRef} />
        </ul>
      </div>
      <div className="w-full flex mt-4 justify-center text-base">
        {isLoading ? (
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status">
            <span className="absolute -m-px h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        ) : (
          <>
            <button onClick={() => toggleKeyView()} className="p-2 bg-[#4CAF50] text-white font-bold rounded-l-lg">
              <FaKey />
            </button>
            {isKeyViewOpen ? (
              <div className="flex w-full">
                <button
                  className="p-2 border border-slate-300 outline-none bg-white"
                  onClick={() => setIsKeySecret(!isKeySecret)}>
                  {isKeySecret ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                </button>
                <input
                  type={isKeySecret ? "password" : "text"}
                  className="flex-1 p-2 border border-x-0 border-slate-300 outline-none"
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
                className="flex-1 p-2 border border-slate-300 outline-none resize-none overflow-auto h-auto"
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
              className="p-2 bg-[#4CAF50] text-white font-bold rounded-r-lg"
              onClick={isKeyViewOpen ? handleSubmitKey : handleSendMessage}>
              {isKeyViewOpen ? "Save" : "Send"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
