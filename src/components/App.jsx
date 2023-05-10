import React, { useState, useEffect, useMemo } from "react";

import { useSandpack } from "@codesandbox/sandpack-react";
import { v4 as uuid } from "uuid";

import { editorConfigObject } from "@/constants";
import { Chat } from "@/components/Chat";
import { Preview } from "@/components/Preview";
import { Editor } from "@/components/Editor";
import { Sidebar } from "@/components/Sidebar";
import { FileMenuBar } from "@/components/FileMenuBar";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

// TODO: extract logic to custom hook
export function App({ currentTemplate, setCurrentTemplate }) {
  // state
  const { sandpack } = useSandpack(); // used to get current files, and switch view when loading a snippet

  // snippet state
  const [snippetTitleInputValue, setSnippetTitleInputValue] =
    useState("untitled");
  const [currentSnippetId, setCurrentSnippetId] = useState(null);
  const [savedSnippets, setSavedSnippets] = useState([]);

  // chat state
  const [messages, setMessages] = useState([]);

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

  const saveAs = () => {
    // create new snippet
    const id = uuid();
    const snippet = {
      templateName: currentTemplate,
      id: id,
      code: sandpack.files,
      name: snippetTitleInputValue,
    };

    // update state
    setSavedSnippets((prevSnippets) => {
      return [...prevSnippets, snippet];
    });

    setCurrentSnippetId(id);

    // sync with local storage
    const currentSnippets = JSON.parse(localStorage.getItem("snippets")) || [];
    currentSnippets.push(snippet);
    localStorage.setItem("snippets", JSON.stringify(currentSnippets));
  };

  const newSnippet = () => {
    setSnippetTitleInputValue("untitled");
    // save existing snippet
    if (currentSnippetId) {
      saveSnippet();
    }

    // create new snippet
    const id = uuid();
    const snippet = {
      templateName: currentTemplate,
      id: id,
      code: sandpack.files,
      name: snippetTitleInputValue, // TODO: add name input
    };

    // update state
    setSavedSnippets((prevSnippets) => {
      return [...prevSnippets, snippet];
    });

    setCurrentSnippetId(id);

    // sync with local storage
    const currentSnippets = JSON.parse(localStorage.getItem("snippets")) || [];
    currentSnippets.push(snippet);
    localStorage.setItem("snippets", JSON.stringify(currentSnippets));
  };

  // snippet CRUD
  const saveSnippet = () => {
    if (!currentSnippetId) {
      const id = uuid();
      const snippet = {
        templateName: currentTemplate,
        id: id,
        code: sandpack.files,
        name: snippetTitleInputValue, // TODO: add name input
      };

      // update state
      setSavedSnippets((prevSnippets) => {
        return [...prevSnippets, snippet];
      });

      setCurrentSnippetId(id);

      // sync with local storage
      const currentSnippets =
        JSON.parse(localStorage.getItem("snippets")) || [];
      currentSnippets.push(snippet);
      localStorage.setItem("snippets", JSON.stringify(currentSnippets));
    } else {
      const updatedSnippets = savedSnippets.map((savedSnippet) => {
        if (savedSnippet.id === currentSnippetId) {
          const updatedSnippet = {
            ...savedSnippet,
            code: sandpack.files,
            name: snippetTitleInputValue,
          };
          return updatedSnippet;
        } else {
          return savedSnippet;
        }
      });
      setSavedSnippets(updatedSnippets);
      localStorage.setItem("snippets", JSON.stringify(updatedSnippets));
    }
  };

  const removeSnippet = (id) => {
    // update state
    setSavedSnippets((prevSnippets) =>
      prevSnippets.filter((snippet) => snippet.id !== id)
    );

    // sync with local storage
    const updatedSnippets = savedSnippets.filter(
      (snippet) => snippet.id !== id
    );
    localStorage.setItem("snippets", JSON.stringify(updatedSnippets));
  };

  const loadSnippet = (snippetId) => {
    // get snippet from state
    const snippet = savedSnippets.find(
      (savedSnippet) => savedSnippet.id === snippetId
    );

    // update sandpack
    if (!snippet) return;
    setCurrentTemplate(snippet.templateName);
    setCurrentSnippetId(snippet.id);
    setSnippetTitleInputValue(snippet.name);
    sandpack.updateFile(snippet.code);
  };

  // initial snippet load
  useEffect(() => {
    if (typeof window === "undefined" || !window.localStorage) {
      return [];
    }
    const snippets = JSON.parse(localStorage.getItem("snippets"));

    if (!snippets) return;

    setSavedSnippets(snippets);
  }, []);

  // keyboard shortcuts
  useKeyboardShortcuts({
    toggleChat,
    toggleMenu,
    saveSnippet,
    saveAs,
    newSnippet,
  });

  // file menu bar items
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
