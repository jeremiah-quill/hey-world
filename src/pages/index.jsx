import React, { useState, useEffect } from "react";

import { Sidebar } from "@/components/Sidebar";
import { defaultHtml, defaultCss } from "@/constants";
import { Chat } from "@/components/Chat";
import {
  SandpackProvider,
  SandpackLayout, // fix this hack: SandpackPreview won't leave loading state without being wrapped in SandpackLayout
  SandpackCodeEditor,
  SandpackPreview,
} from "@codesandbox/sandpack-react";

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
  const [savedCreations, setSavedCreations] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <SandpackProvider
      template="static"
      files={{
        "/index.html": { code: defaultHtml, active: true },
        "/styles.css": { code: defaultCss, active: true },
      }}>
      <div className="w-full h-screen flex gap-2 p-2">
        {/* <Sidebar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} savedCreations={savedCreations} /> */}
        <div className="flex-1 grid grid-rows-2 gap-2">
          <div className="row-span-2 rounded-lg overflow-hidden border editor">
            <SandpackCodeEditor showLineNumbers showInlineErrors />
          </div>
        </div>
        <div className="flex-1 h-full grid grid-rows-2 gap-2">
          <div className="row-span-1 h-full bg-[#292524] rounded-lg overflow-hidden preview border">
            <SandpackLayout>
              <SandpackPreview />
            </SandpackLayout>
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
