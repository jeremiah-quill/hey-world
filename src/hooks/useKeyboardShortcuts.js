// hooks/useKeyboardShortcuts.js
import { useEffect } from "react";

export function useKeyboardShortcuts({
  toggleChat,
  toggleMenu,
  saveSnippet,
  saveAs,
  newSnippet,
}) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.metaKey || event.ctrlKey) {
        event.preventDefault();

        switch (event.key.toLowerCase()) {
          case "b":
            toggleChat();
            break;
          case "m":
            toggleMenu();
            break;
          case "s":
            if (event.shiftKey) {
              saveAs();
            } else {
              saveSnippet();
            }
            break;
          case "n":
            newSnippet();
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [toggleChat, toggleMenu, saveSnippet, saveAs, newSnippet]);
}
