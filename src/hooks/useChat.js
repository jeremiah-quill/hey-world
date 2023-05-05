import { useState } from "react";
import { useUserSettings } from "@/context/userSettingsContext";

export const useChat = (messages, setMessages) => {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  const { userSettings, key } = useUserSettings();

  const sendMessage = async () => {
    if (inputValue.trim() === "") return;

    setIsLoading(true);

    setInputValue("");

    const newMessages = [...messages, { role: "user", content: inputValue }];
    setMessages(newMessages);

    const response = await fetch("/api/gpt-edge", {
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

  const handleChatInputChange = (e) => {
    setInputValue(e.target.value);
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

  const handleKeyDown = (e, onKeyDown = () => {}) => {
    if (e.key === "Enter" && !e.shiftKey) {
      onKeyDown();
    }
  };

  return {
    inputValue,
    setInputValue,
    isLoading,
    setIsLoading,
    error,
    setError,
    sendMessage,
    resetChat,
    handleChatInputChange,
    handleKeyDown,
  };
};
