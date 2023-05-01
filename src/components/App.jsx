import React, { useState, useEffect, useRef, useMemo } from "react";

import { RxCaretDown } from "react-icons/rx";
import { useSandpack } from "@codesandbox/sandpack-react";
import { v4 as uuid } from "uuid";

import { editorConfigObject } from "@/constants";
import { Chat } from "@/components/Chat";
import { Preview } from "@/components/Preview";
import { Editor } from "@/components/Editor";
import { Sidebar } from "@/components/Sidebar";
import { AccessChat } from "@/components/AccessChat";
import { CurrentProjectBar } from "@/components/CurrentProjectBar";

export function App({ serverKey, currentTemplate, setCurrentTemplate }) {
  const { sandpack } = useSandpack(); // used to get current files, and switch view when loading a project
  const [openaiKey, setOpenaiKey] = useState(null); // TODO: can I just pass in serverKey here?
  const [projectTitleInputValue, setProjectTitleInputValue] = useState("");

  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const resetProject = () => {
    setCurrentProjectId(null);
    setProjectTitleInputValue("");
    sandpack.resetAllFiles();
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
        return [...prevCreations, project];
      });

      setCurrentProjectId(id);

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

    if (!projects) return;

    setSavedCreations(projects);
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
  }, [currentProjectId, savedCreations]);

  return (
    <div className="w-full h-screen flex gap-2 p-2">
      <Sidebar
        isMenuOpen={isMenuOpen}
        toggleMenu={toggleMenu}
        savedCreations={savedCreations}
        onProjectClick={loadProject}
        onRemoveClick={removeProject}
        currentProjectId={currentProjectId}
      />
      {/* left column */}
      <div className="flex-1 flex flex-col gap-2 overflow-hidden">
        <Editor>
          <CurrentProjectBar
            projectTitleInputValue={projectTitleInputValue}
            setProjectTitleInputValue={setProjectTitleInputValue}
            saveProject={saveProject}
            currentProject={memoizedCurrentProject}
            isTemplatePickerOpen={isTemplatePickerOpen}
            toggleTemplatePicker={toggleTemplatePicker}
            currentTemplate={currentTemplate}
            setIsTemplatePickerOpen={setIsTemplatePickerOpen}
            editorConfigObject={editorConfigObject}
            setCurrentTemplate={setCurrentTemplate}
            resetProject={resetProject}
          />
        </Editor>
      </div>
      {/* right column */}
      <div className="flex-1 h-full flex flex-col gap-2 ">
        {/* top right container */}
        <div className="h-full bg-[#292524] rounded-lg overflow-hidden preview border flex-1">
          <Preview />
        </div>
        {/* bottom right container */}
        <div className="shadow-inner border rounded-lg overflow-hidden relative flex-1">
          {openaiKey ? (
            <Chat openaiKey={openaiKey} />
          ) : (
            <div className="grid place-items-center absolute inset-0">
              <AccessChat setOpenaiKey={setOpenaiKey} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
