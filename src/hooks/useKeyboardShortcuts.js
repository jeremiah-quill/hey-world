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
        switch (event.key.toLowerCase()) {
          case "b":
            event.preventDefault();
            toggleChat();
            break;
          case "m":
            event.preventDefault();
            toggleMenu();
            break;
          case "s":
            if (event.shiftKey) {
              event.preventDefault();
              saveAs();
            } else {
              event.preventDefault();
              saveSnippet();
            }
            break;
          // case "n":
          //   newSnippet();
          //   break;
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
