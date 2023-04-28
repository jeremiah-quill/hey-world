import React, { useState, useEffect, useRef } from "react";

import { RxCaretDown } from "react-icons/rx";

import { editorConfigObject } from "@/constants";
import { Chat } from "@/components/Chat";
import { Preview } from "@/components/Preview";
import { Editor } from "@/components/Editor";
import { Sidebar } from "@/components/Sidebar"; // TODO: add this when

export function App({ serverKey, currentTemplate, setCurrentTemplate }) {
  const [openaiKey, setOpenaiKey] = useState(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTemplatePickerOpen, setIsTemplatePickerOpen] = useState(false);

  const [savedCreations, setSavedCreations] = useState([]); // TODO: implement saved creations

  // if a key was loaded from env, use it and clear key from local storage (as a precaution)
  // otherwise, check if a key was saved in local storage and use that
  useEffect(() => {
    if (serverKey) {
      localStorage.removeItem("openai-key");
      return;
    }
    const userKey = localStorage.getItem("openai-key");
    setOpenaiKey(userKey);
  }, [serverKey]);

  // UI/state handlers
  const toggleTemplatePicker = () => {
    setIsTemplatePickerOpen(!isTemplatePickerOpen);
  };
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  // close template picker when clicking outside of it
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsTemplatePickerOpen(false);
      }
    };
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  return (
    <div className="w-full h-screen flex gap-2 p-2">
      {/* <Sidebar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} savedCreations={savedCreations} /> */}
      <div className="flex-1 grid grid-rows-2 gap-2">
        <div className="row-span-2 rounded-lg overflow-hidden border editor relative">
          <div className="absolute z-[1000] right-[10px] top-[6px] " ref={dropdownRef}>
            <button onClick={toggleTemplatePicker} className="flex gap-2 items-center text-base">
              <div className="flex gap-1 items-center">
                {editorConfigObject[currentTemplate].icon}
                {currentTemplate}
              </div>
              {
                <RxCaretDown
                  className={`text-2xl transition-all ${isTemplatePickerOpen ? "rotate-180" : "rotate-0"}`}
                />
              }
            </button>
            {isTemplatePickerOpen && (
              <ul className="text-base border bg-white rounded absolute">
                {Object.keys(editorConfigObject).map((key, idx) => (
                  <li
                    className="p-2 cursor-pointer hover:bg-slate-200 flex gap-1 items-center"
                    key={idx}
                    onClick={() => {
                      setCurrentTemplate(key);
                      setIsTemplatePickerOpen(false);
                    }}>
                    {editorConfigObject[key].icon}
                    {key}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Editor />
        </div>
      </div>
      <div className="flex-1 h-full grid grid-rows-2 gap-2">
        <div className="row-span-1 h-full bg-[#292524] rounded-lg overflow-hidden preview border">
          <Preview />
        </div>
        <div className="row-span-1 shadow-inner border rounded-lg overflow-hidden relative">
          {openaiKey ? (
            <Chat openaiKey={openaiKey} />
          ) : (
            <div className="grid place-items-center absolute inset-0">
              <GptKeyForm setOpenaiKey={setOpenaiKey} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function GptKeyForm({ setOpenaiKey }) {
  const [inputValue, setInputValue] = useState("");

  function handleChange(e) {
    setInputValue(e.target.value);
  }

  function handleSubmitKey() {
    localStorage.setItem("openai-key", inputValue);
    setOpenaiKey(inputValue);
    setInputValue("");
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmitKey();
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full h-full p-4">
      <div className="grid gap-6 mt-8 text-base max-w-xl mx-auto">
        <h2 className="font-bold text-center">Activate a personal AI chatbot for design and development assistance</h2>
        <p className="text-sm">
          This chatbot is designed to assist you with web design and web development tasks. To access the chatbot, you
          have two options:
        </p>
        <ol className="list-decimal prose prose-sm list-inside">
          <li className="text-sm">
            <strong>Add a private OpenAI API key:</strong> You can enter your OpenAI API key directly into the input
            field below. By doing so, your API key will be securely stored in your browser's local storage. Note that
            your API key will only be used to communicate with the OpenAI API and won't be sent to our servers.
          </li>
          <li className="text-sm">
            <strong>Clone the source code:</strong> Alternatively, you can clone this project's{" "}
            <a className="underline" target="_blank" rel="noopener" href="https://github.com/jeremiah-quill/hey-world">
              source code
            </a>{" "}
            and add your API key as an environment variable when deploying or running locally.
          </li>
        </ol>
        <p className="text-sm">
          If you don't have an OpenAI API key, you can obtain one by visiting{" "}
          <a className="underline" target="_blank" rel="noopener" href="https://platform.openai.com/account/api-keys">
            OpenAI API Keys.
          </a>
        </p>
      </div>

      <div className="mt-auto flex text-base">
        <input
          type="text"
          className="flex-1 p-2 rounded-l-lg border border-slate-300 outline-none"
          placeholder="Enter your OpenAI API key"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <button className="p-2 bg-[#10a37f] text-white font-bold rounded-r-lg" onClick={handleSubmitKey}>
          Submit
        </button>
      </div>
    </div>
  );
}
