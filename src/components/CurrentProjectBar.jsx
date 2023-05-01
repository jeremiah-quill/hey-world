import React, { useEffect, useRef } from "react";
import { RxCaretDown } from "react-icons/rx";

export const CurrentProjectBar = ({
  projectTitleInputValue,
  setProjectTitleInputValue,
  saveProject,
  isTemplatePickerOpen,
  toggleTemplatePicker,
  currentTemplate,
  editorConfigObject,
  setCurrentTemplate,
  setIsTemplatePickerOpen,
  currentProject,
  resetProject,
}) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    saveProject(currentProject);
  };

  useEffect(() => {
    if (currentProject) {
      setProjectTitleInputValue(currentProject.name);
    } else {
      setProjectTitleInputValue("");
    }
  }, [currentProject]);

  // TODO: bug in this input. sometimes it doesn't update when switching between projects
  return (
    <div className="flex gap-2 p-2 bg-slate-200 justify-between rounded-lg">
      <form onSubmit={handleSubmit}>
        <input
          required={true}
          className="rounded p-1 border-slate-300 outline-none"
          value={projectTitleInputValue || ""}
          onChange={(e) => setProjectTitleInputValue(e.target.value)}
          placeholder="hey world. landing page"
        />
        <input className="ml-2 hover:opacity-50 cursor-pointer" type="submit" value={currentProject ? "Save" : "Add"} />
      </form>
      <button className="hover:opacity-50" onClick={resetProject}>
        Start fresh
      </button>
      <div className="relative z-[1000]" ref={dropdownRef}>
        <button onClick={toggleTemplatePicker} className="flex gap-2 items-center">
          <div className="flex gap-1 items-center">
            {editorConfigObject[currentTemplate].icon}
            {currentTemplate}
          </div>
          {<RxCaretDown className={`text-2xl transition-all ${isTemplatePickerOpen ? "rotate-180" : "rotate-0"}`} />}
        </button>
        {isTemplatePickerOpen && (
          <ul className="border bg-white rounded absolute">
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
    </div>
  );
};
