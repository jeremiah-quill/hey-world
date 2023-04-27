import React, { useState, useEffect } from "react";

import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { githubLight, githubDark } from "@uiw/codemirror-theme-github";

import { Editor } from "@/components/Editor";
import { Sidebar } from "@/components/Sidebar";
import { Preview } from "@/components/Preview";
import { defaultHtml, defaultCss } from "@/constants";
import { Chat } from "@/components/Chat";

export async function getServerSideProps() {
  return {
    props: {
      serverKey: process.env.OPENAI_API_KEY || null,
    },
  };
}

export default function CreatePage({ serverKey }) {
  const [openaiKey, setOpenaiKey] = useState(null);
  const [htmlCode, setHtmlCode] = useState(defaultHtml);
  const [cssCode, setCssCode] = useState(defaultCss);
  const [previewContent, setPreviewContent] = useState({ html: defaultHtml, css: defaultCss });
  const [savedCreations, setSavedCreations] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (serverKey) {
      localStorage.removeItem("openai-key");
      return;
    }
    const userKey = localStorage.getItem("openai-key");
    if (!userKey) return;
    setOpenaiKey(userKey);
  }, []);

  const onHtmlChange = (value) => {
    setHtmlCode(value);
    setPreviewContent({ html: value, css: cssCode });
  };

  const onCssChange = (value) => {
    setCssCode(value);
    setPreviewContent({ html: htmlCode, css: value });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="w-full h-screen flex gap-2 p-2">
      <Sidebar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} savedCreations={savedCreations} />
      <div className="flex-1 grid grid-rows-2 gap-2">
        <div className="row-span-1 rounded-lg overflow-hidden">
          <Editor value={htmlCode} theme={githubDark} extensions={[html()]} onChange={onHtmlChange} />
        </div>
        <div className="row-span-1 rounded-lg overflow-hidden">
          <Editor value={cssCode} theme={githubDark} extensions={[css()]} onChange={onCssChange} />
        </div>
      </div>
      <div className="flex-1 h-full grid grid-rows-2 gap-2">
        <div className="row-span-1 h-full bg-[#292524] rounded-lg overflow-hidden">
          <Preview previewContent={previewContent} />
        </div>
        <div className="row-span-1 shadow-inner border rounded-lg overflow-hidden relative">
          {openaiKey || serverKey ? (
            <Chat openaiKey={openaiKey || serverKey} />
          ) : (
            <div className="grid place-items-center absolute inset-0">
              <GptKeyForm setOpenaiKey={setOpenaiKey} />
            </div>
          )}{" "}
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
