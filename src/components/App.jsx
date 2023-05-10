import React, { useState } from "react";

import { useSandpack } from "@codesandbox/sandpack-react";

import { editorConfigObject } from "@/constants";
import { Chat } from "@/components/Chat";
import { Preview } from "@/components/Preview";
import { Editor } from "@/components/Editor";
import { Sidebar } from "@/components/Sidebar";
import { FileMenuBar } from "@/components/FileMenuBar";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useSnippetManager } from "@/hooks/useSnippetManager";

// TODO: extract logic to custom hook
export function App({ currentTemplate, setCurrentTemplate }) {
  const [messages, setMessages] = useState([]); // keeping this here so chat doesn't reset on open/close

  const { sandpack } = useSandpack(); // used to get current files, and switch view when loading a snippet

  // snippet state/crud handlers
  const {
    snippetTitleInputValue,
    setSnippetTitleInputValue,
    currentSnippetId,
    savedSnippets,
    saveAs,
    newSnippet,
    saveSnippet,
    removeSnippet,
    loadSnippet,
  } = useSnippetManager({ currentTemplate, setCurrentTemplate, sandpack });

  // ui state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false); // TODO: remove this, use [key, session instead] -> what does this mean???
  const [isTemplatePickerOpen, setIsTemplatePickerOpen] = useState(false);

  // UI/state handlers
  const toggleTemplatePicker = () => {
    setIsTemplatePickerOpen(!isTemplatePickerOpen);
  };
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  // keyboard shortcuts
  useKeyboardShortcuts({
    toggleChat,
    toggleMenu,
    saveSnippet,
    saveAs,
    newSnippet,
  });

  // file menubar items
  const menuItems = [
    {
      title: "File",
      options: [
        {
          name: "New",
          shortcut: "Cmd+N",
          onClick: () => newSnippet(),
        },
        {
          name: "Save",
          shortcut: "Cmd+S",
          onClick: () => saveSnippet(),
        },
        {
          name: "Save As",
          shortcut: "Cmd+Shift+S",
          onClick: () => saveAs(),
        },
      ],
    },
  ];

  return (
    <div className="flex h-screen w-full gap-2 p-2 transition-all dark:bg-slate-800">
      <Sidebar
        isMenuOpen={isMenuOpen}
        toggleMenu={toggleMenu}
        savedSnippets={savedSnippets}
        onSnippetClick={loadSnippet}
        onRemoveClick={removeSnippet}
        currentSnippetId={currentSnippetId}
      />
      {/* left column */}
      <div className="relative grid flex-1">
        <Editor>
          <FileMenuBar
            snippetTitleInputValue={snippetTitleInputValue}
            setSnippetTitleInputValue={setSnippetTitleInputValue}
            saveSnippet={saveSnippet}
            isTemplatePickerOpen={isTemplatePickerOpen}
            toggleTemplatePicker={toggleTemplatePicker}
            currentTemplate={currentTemplate}
            setIsTemplatePickerOpen={setIsTemplatePickerOpen}
            editorConfigObject={editorConfigObject}
            setCurrentTemplate={setCurrentTemplate}
            menuItems={menuItems}
          />
        </Editor>
      </div>
      {/* right column */}
      <div className="flex h-full flex-1 flex-col gap-2 ">
        {/* top right container */}
        <div className="preview flex-1 overflow-hidden rounded-lg border dark:border-slate-500">
          <Preview />
        </div>
        {/* bottom right container */}
        {isChatOpen && (
          <Chat
            setIsChatOpen={setIsChatOpen}
            isChatOpen={isChatOpen}
            messages={messages}
            setMessages={setMessages}
          />
        )}
        {/* floating chat button */}
        <button
          className="absolute bottom-[20px] right-[20px] z-[999]  rounded-full bg-white px-3 py-1 shadow-md hover:bg-slate-300 focus:outline-none dark:bg-slate-700 hover:dark:bg-slate-500"
          onClick={toggleChat}
        >
          <div className="text-3xl">🤖</div>
        </button>
      </div>
    </div>
  );
}
