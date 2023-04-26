import React, { useState } from "react";

import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { githubLight, githubDark } from "@uiw/codemirror-theme-github";

import { Editor } from "@/components/Editor";
import { Sidebar } from "@/components/Sidebar";
import { Preview } from "@/components/Preview";
import { defaultHtml, defaultCss } from "@/constants";

export default function CreatePage() {
  const [htmlCode, setHtmlCode] = React.useState(defaultHtml);
  const [cssCode, setCssCode] = React.useState(defaultCss);
  const [previewContent, setPreviewContent] = useState({ html: defaultHtml, css: defaultCss });
  const [savedCreations, setSavedCreations] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      {/* <Sidebar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} savedCreations={savedCreations} /> */}
      <div className="flex-1 grid grid-rows-2 gap-2">
        <div className="row-span-1 border-2">
          <Editor value={htmlCode} theme={githubDark} extensions={[html()]} onChange={onHtmlChange} />
        </div>
        <div className="row-span-1 border-2">
          <Editor value={cssCode} theme={githubDark} extensions={[css()]} onChange={onCssChange} />
        </div>
      </div>
      <div className="flex-1 h-full grid grid-rows-2 gap-2">
        <div className="row-span-1 border-2 h-full bg-[#292524]">
          <Preview previewContent={previewContent} />
        </div>
        <div className="row-span-1 border-2 grid place-items-center">
          <h2 className="text-[#10a37f] text-3xl font-extrabold">AI Chat coming soon!</h2>
        </div>
      </div>
    </div>
  );
}
