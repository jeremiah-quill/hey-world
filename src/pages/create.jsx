import React from "react";

import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { githubLight, githubDark } from "@uiw/codemirror-theme-github";

import { Editor } from "@/components/Editor";
import { SavedList } from "@/components/SavedList";

export default function CreatePage() {
  const onChange = React.useCallback((value, viewUpdate) => {
    console.log("value:", value);
  }, []);

  return (
    <div className="w-full h-screen grid grid-cols-5 gap-2">
      {/* 1/5 of the screen */}
      <div className="col-span-1 h-full flex flex-col max-h-screen bg-slate-300 bg-opacity-20">
        {/* Sidebar */}
        <div className="flex-1 overflow-y-auto">
          {/* List of items */}
          <SavedList className="h-full overflow-y-auto" />
        </div>
        <div className="p-4 bg-slate-500 ">
          {/* Small nav */}
          <ul className="grid gap-4">
            <li>Account</li>
            <li>Settings</li>
            <li>etc.</li>
          </ul>
        </div>
      </div>

      {/* 2/5 of the screen */}
      <div className="col-span-2 grid grid-rows-2 gap-2">
        {/* HTML window */}
        <div className="row-span-1 bg-slate-200">
          <Editor value={"<h1>hey world</h1>"} theme={githubDark} extensions={[html()]} onChange={onChange} />
        </div>
        {/* CSS window */}
        <div className="row-span-1 bg-slate-200">
          <Editor
            value={`h1 { 
  color: dodgerblue; 
  font-size: 5rem;
}`}
            theme={githubLight}
            extensions={[css()]}
            onChange={onChange}
          />
        </div>
      </div>

      {/* 2/5 of the screen */}
      <div className="col-span-2 h-full grid grid-rows-2 gap-2">
        {/* preview window */}
        <div className="row-span-1 bg-slate-200">preview</div>
        {/* ai chat window */}
        <div className="row-span-1 bg-slate-200">ai chat</div>
      </div>
    </div>
  );
}
