import React, { useState, useEffect, useRef } from "react";

import { Chat } from "@/components/Chat";
import { SandpackProvider, SandpackCodeEditor } from "@codesandbox/sandpack-react";
import { RxCaretDown } from "react-icons/rx";

import { Sidebar } from "@/components/Sidebar"; // TODO: add this when
import { editorConfigObject } from "@/constants";
import { Preview } from "@/components/Preview";
import { Editor } from "@/components/Editor";

// get the OpenAI API key from the environment variables or return null
export async function getServerSideProps() {
  return {
    props: {
      serverKey: process.env.OPENAI_API_KEY || null,
    },
  };
}

export default function Home({ serverKey }) {
  const [openaiKey, setOpenaiKey] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTemplatePickerOpen, setIsTemplatePickerOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState("React"); // TODO: review this, but I think I like it
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
    if (!userKey) return;
  }, []);

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
    <SandpackProvider
      template={editorConfigObject[currentTemplate].templateName}
      files={editorConfigObject[currentTemplate].files}>
      <div className="w-full h-screen flex gap-2 p-2">
        {/* <Sidebar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} savedCreations={savedCreations} /> */}
        <div className="flex-1 grid grid-rows-2 gap-2">
          <div className="row-span-2 rounded-lg overflow-hidden border editor relative">
            <div className="absolute z-[1000] right-[10px] top-[6px] " ref={dropdownRef}>
              <button onClick={toggleTemplatePicker} className="flex gap-2 items-center text-base">
                <div>{currentTemplate}</div>
                {
                  <RxCaretDown
                    className={`text-2xl transition-all ${isTemplatePickerOpen ? "rotate-180" : "rotate-0"}`}
                  />
                }
              </button>
              {isTemplatePickerOpen && (
                <ul className="text-base border bg-white rounded">
                  {Object.keys(editorConfigObject).map((key, idx) => (
                    <li
                      className="p-2 cursor-pointer hover:bg-slate-200"
                      key={idx}
                      onClick={() => {
                        setCurrentTemplate(key);
                        setIsTemplatePickerOpen(false);
                      }}>
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
            {openaiKey || serverKey ? (
              <Chat openaiKey={openaiKey || serverKey} />
            ) : (
              <div className="grid place-items-center absolute inset-0">
                <GptKeyForm setOpenaiKey={setOpenaiKey} />
              </div>
            )}
          </div>
        </div>
      </div>
    </SandpackProvider>
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
      setOpenaiKey(true);
    }
  };

  return (
    <div className="flex">
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
  );
}
