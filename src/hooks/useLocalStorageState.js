import { useState, useEffect } from "react";

function useLocalStorageState(key, defaultValue) {
  const [state, setState] = useState(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  const toggleSetting = (settingKey) => {
    setState((prevState) => {
      const newSettings = {
        ...prevState,
        [settingKey]: !prevState[settingKey],
      };
      return newSettings;
    });
  };

  return [state, toggleSetting];
}
