import React, { useState, useEffect, useRef, useMemo } from "react";

import { RxCaretDown } from "react-icons/rx";
import { useSandpack } from "@codesandbox/sandpack-react";
import { v4 as uuid } from "uuid";

import { editorConfigObject } from "@/constants";
import { Chat } from "@/components/Chat";
import { Preview } from "@/components/Preview";
import { Editor } from "@/components/Editor";
import { Sidebar } from "@/components/Sidebar";
import { GptKeyForm } from "@/components/GptKeyForm";

export function App({ serverKey, currentTemplate, setCurrentTemplate }) {
  const { sandpack } = useSandpack(); // used to get current files, and switch view when loading a project
  const [openaiKey, setOpenaiKey] = useState(null); // TODO: can I just pass in serverKey here?
  const [projectTitleInputValue, setProjectTitleInputValue] = useState("");

  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isTemplatePickerOpen, setIsTemplatePickerOpen] = useState(false);

  const [currentProjectId, setCurrentProjectId] = useState(null);

  const [savedCreations, setSavedCreations] = useState([]);

  // UI/state handlers
  const toggleTemplatePicker = () => {
    setIsTemplatePickerOpen(!isTemplatePickerOpen);
  };
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const saveProject = (currentProject = null) => {
    if (!currentProject) {
      const id = uuid();
      const project = {
        templateName: currentTemplate,
        id: id,
        code: sandpack.files,
        name: projectTitleInputValue, // TODO: add name input
      };

      // update state
      setSavedCreations((prevCreations) => {
        console.log("prevCreations", prevCreations);
        return [...prevCreations, project];
      });

      // sync with local storage
      const currentProjects = JSON.parse(localStorage.getItem("projects")) || [];
      currentProjects.push(project);
      localStorage.setItem("projects", JSON.stringify(currentProjects));
    } else {
      const updatedProjects = savedCreations.map((creation) => {
        if (creation.id === currentProject.id) {
          return {
            ...creation,
            code: sandpack.files,
            name: projectTitleInputValue,
          };
        }
        return creation;
      });
      setSavedCreations(updatedProjects);
      localStorage.setItem("projects", JSON.stringify(updatedProjects));
    }
  };

  const removeProject = (id) => {
    // update state
    setSavedCreations((prevCreations) => prevCreations.filter((creation) => creation.id !== id));

    // sync with local storage
    const updatedProjects = savedCreations.filter((creation) => creation.id !== id);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
  };

  const loadProject = (projectId) => {
    // get project from state
    const project = savedCreations.find((creation) => creation.id === projectId);

    // update sandpack
    if (!project) return;
    setCurrentTemplate(project.templateName);
    setCurrentProjectId(project.id);
    sandpack.updateFile(project.code);
  };

  // effects
  useEffect(() => {
    if (typeof window === "undefined" || !window.localStorage) {
      return [];
    }
    const projects = JSON.parse(localStorage.getItem("projects"));
    console.log("loaded these from local storage", projects);

    if (projects?.length === 0) return;

    setSavedCreations(projects);
    // setProjectTitleInputValue(projects[0].name);
  }, []);

  // if a key was loaded from env, use it and clear key from local storage (as a precaution)
  // otherwise, check if a key was saved in local storage and use that
  // TODO: I feel like this sucks
  useEffect(() => {
    if (serverKey) {
      localStorage.removeItem("openai-key");
      return;
    }
    const userKey = localStorage.getItem("openai-key");
    setOpenaiKey(userKey);
  }, [serverKey]);

  const memoizedCurrentProject = useMemo(() => {
    return savedCreations.find((creation) => creation.id === currentProjectId);
  }, [currentProjectId]);

  return (
    <div className="w-full h-screen flex gap-2 p-2">
      <Sidebar
        isMenuOpen={isMenuOpen}
        toggleMenu={toggleMenu}
        savedCreations={savedCreations}
        onProjectClick={loadProject}
        onRemoveClick={removeProject}
      />
      <div className="flex-1 grid gap-2">
        {/* left column */}
        <div className="row-span-2 rounded-lg overflow-hidden border editor relative">
          <CurrentProjectBar
            projectTitleInputValue={projectTitleInputValue}
            setProjectTitleInputValue={setProjectTitleInputValue}
            saveProject={saveProject}
            currentProject={memoizedCurrentProject || null}
            isTemplatePickerOpen={isTemplatePickerOpen}
            toggleTemplatePicker={toggleTemplatePicker}
            currentTemplate={currentTemplate}
            setIsTemplatePickerOpen={setIsTemplatePickerOpen}
            editorConfigObject={editorConfigObject}
            setCurrentTemplate={setCurrentTemplate}
          />
          <Editor />
        </div>
      </div>
      {/* right column */}
      <div className="flex-1 h-full grid grid-rows-2 gap-2">
        {/* top right container */}
        <div className="row-span-1 h-full bg-[#292524] rounded-lg overflow-hidden preview border">
          <Preview />
        </div>
        {/* bottom right container */}
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

const CurrentProjectBar = ({
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

  // TODO: bug in this input. sometimes it doesn't update when switching between projects
  return (
    <div className="flex gap-2 p-2 border-b">
      <form onSubmit={handleSubmit}>
        <input
          required={true}
          className="border-b p-1 border-slate-300 outline-none"
          value={projectTitleInputValue || currentProject?.name || ""}
          onChange={(e) => setProjectTitleInputValue(e.target.value)}
          placeholder="hey world. landing page"
        />
        <input className="ml-2 hover:opacity-50" type="submit" value={currentProject ? "Save" : "Add"} />
      </form>
      <div className="relative ml-auto z-[1000]" ref={dropdownRef}>
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
