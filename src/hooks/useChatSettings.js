import { useState } from "react";
import { useToast } from "@/context/toastContext";
import { useUserSettings } from "@/context/userSettingsContext";
import { useSession } from "next-auth/react";

export const useChatSettings = ({ onClose }) => {
  // state
  const { data: session } = useSession();
  // const [loading, setLoading] = useState(false);
  const { userSettings, toggleSetting, key, syncKey } = useUserSettings();
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState(key || "");
  const [selectedOption, setSelectedOption] = useState(
    !session ? "user" : userSettings.isUseUserKeyEnabled ? "user" : "free"
  );

  const showToast = useToast();

  // handlers
  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

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
      showToast("Free API key selected", "bg-green", "text-white");
      onClose();
      return;
    }

    // submit user selection
    if (selectedOption === "user") {
      if (inputValue === "") {
        setLoading(false);
        showToast("Please enter a key", "bg-red-500", "text-white");
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
        showToast("Please enter a valid key", "bg-red-500", "text-white");
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
    setInputValue("");
    showToast("Key removed successfully", "bg-green", "text-white");

    // if user is not logged in, close the modal
    if (!session) {
      onClose();
      return;
    }

    // if user is logged in, set the default to free and make sure the toggle is off
    setSelectedOption("free");
    toggleSetting("isUseUserKeyEnabled", false);
  };

  return {
    loading,
    inputValue,
    setInputValue,
    handleChange,
    handleClick,
    handleSubmit,
    handleRemoveKey,
    selectedOption,
  };
};
