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
    <div className="flex justify-between gap-2 bg-slate-200 p-2 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
      <form onSubmit={handleSubmit}>
        <input
          required={true}
          className="rounded border-slate-300 p-1 outline-none dark:bg-slate-700"
          value={projectTitleInputValue || ""}
          onChange={(e) => setProjectTitleInputValue(e.target.value)}
          placeholder="Landing page"
        />
        <input
          className="ml-2 cursor-pointer hover:opacity-50"
          type="submit"
          value={currentProject ? "Save" : "Add"}
        />
      </form>
      <button className="hover:opacity-50" onClick={resetProject}>
        Start fresh
      </button>
      <div className="relative z-[500]" ref={dropdownRef}>
        <button
          onClick={toggleTemplatePicker}
          className="flex items-center gap-2"
        >
          <div className="flex items-center gap-1">
            {editorConfigObject[currentTemplate].icon}
            {currentTemplate}
          </div>
          {
            <RxCaretDown
              className={`text-2xl transition-all ${
                isTemplatePickerOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          }
        </button>
        {isTemplatePickerOpen && (
          <ul className="absolute w-full rounded border bg-white dark:border-slate-500 dark:bg-slate-800 dark:text-slate-300">
            {Object.keys(editorConfigObject).map((key, idx) => (
              <li
                className="flex cursor-pointer items-center gap-1 p-2 hover:bg-slate-200 dark:hover:bg-slate-500"
                key={idx}
                onClick={() => {
                  setCurrentTemplate(key);
                  setIsTemplatePickerOpen(false);
                }}
              >
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
