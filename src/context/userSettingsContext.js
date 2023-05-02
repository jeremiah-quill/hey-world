import { createContext, useContext, useState, useEffect } from "react";

const UserSettingsContext = createContext();

export function useUserSettings() {
  return useContext(UserSettingsContext);
}

export function UserSettingsProvider({ children }) {
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
        isUseUserKeyEnabled: true,
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
          isUseUserKeyEnabled: true,
        };
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      // Do not update localStorage on the server-side
      return;
    }
    localStorage.setItem("userSettings", JSON.stringify(userSettings));
  }, [userSettings, setUserSettings]);

  const toggleSetting = (settingKey) => {
    setUserSettings((prevState) => ({
      ...prevState,
      [settingKey]: !prevState[settingKey],
    }));
  };

  const value = {
    userSettings,
    toggleSetting,
  };

  return (
    <UserSettingsContext.Provider value={value}>
      {children}
    </UserSettingsContext.Provider>
  );
}
