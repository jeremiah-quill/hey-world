import { createContext, useContext, useState, useEffect } from "react";
import React from "react";
import { useSession } from "next-auth/react";

const UserSettingsContext = createContext();

export function useUserSettings() {
  return useContext(UserSettingsContext);
}

export function UserSettingsProvider({ children }) {
  const { data: session } = useSession();

  const [key, setKey] = useState(() => {
    if (typeof window === "undefined") {
      // Return default settings if running on the server-side
      return "";
    }

    const storedValue = localStorage.getItem("openai-key");
    return storedValue ? storedValue : "";
  });

  const [userSettings, setUserSettings] = useState(() => {
    if (typeof window === "undefined") {
      // Return default settings if running on the server-side
      return {
        isDarkModeEnabled: false,
        isVimModeEnabled: false,
        isEmmetEnabled: false,
        isLivePreviewEnabled: false,
        isAutoCompleteEnabled: false,
        isLineWrappingEnabled: false,
        isUseUserKeyEnabled: false,
      };
    }

    const storedValue = localStorage.getItem("userSettings");
    return storedValue
      ? JSON.parse(storedValue)
      : {
          isDarkModeEnabled: false,
          isVimModeEnabled: false,
          isEmmetEnabled: false,
          isLivePreviewEnabled: false,
          isAutoCompleteEnabled: false,
          isLineWrappingEnabled: false,
          isUseUserKeyEnabled: false,
        };
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      // Do not update localStorage on the server-side
      return;
    }
    // do not save user settings if user is not logged in
    if (!session) return;

    localStorage.setItem("userSettings", JSON.stringify(userSettings));
  }, [userSettings]);

  useEffect(() => {
    if (typeof window === "undefined") {
      // Do not update localStorage on the server-side
      return;
    }
    if (userSettings.isDarkModeEnabled) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [userSettings.isDarkModeEnabled]);

  const [hasMounted, setHasMounted] = React.useState(false);
  React.useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) {
    return null;
  }

  const toggleSetting = (settingKey, value) => {
    // if value is passed, set it to that value
    if (value !== undefined) {
      setUserSettings((prevState) => ({
        ...prevState,
        [settingKey]: value,
      }));
      return;
    }

    // otherwise, toggle it
    setUserSettings((prevState) => ({
      ...prevState,
      [settingKey]: !prevState[settingKey],
    }));
  };
  const syncKey = (key) => {
    if (!session) {
      setKey(key);
      return;
    }

    setKey(key);
    localStorage.setItem("openai-key", key);
  };

  const value = {
    userSettings,
    toggleSetting,
    key,
    syncKey,
  };

  return (
    <UserSettingsContext.Provider value={value}>
      {children}
    </UserSettingsContext.Provider>
  );
}
