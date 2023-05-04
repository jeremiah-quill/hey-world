import React, { useState, useEffect, useMemo } from "react";

import { useSandpack } from "@codesandbox/sandpack-react";
import { v4 as uuid } from "uuid";

import { editorConfigObject } from "@/constants";
import { Chat } from "@/components/Chat";
import { Preview } from "@/components/Preview";
import { Editor } from "@/components/Editor";
import { Sidebar } from "@/components/Sidebar";
import { CurrentProjectBar } from "@/components/CurrentProjectBar";

// TODO: extract logic to custom hook
export function App({ currentTemplate, setCurrentTemplate }) {
  // state
  const { sandpack } = useSandpack(); // used to get current files, and switch view when loading a project

  // project state
  const [projectTitleInputValue, setProjectTitleInputValue] = useState("");
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [savedCreations, setSavedCreations] = useState([]);

  // chat state
  const [messages, setMessages] = useState([]);

  // ui state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false); // TODO: remove this, use [key, session instead] -> what does this mean???
  const [isTemplatePickerOpen, setIsTemplatePickerOpen] = useState(false);

  // UI/state handlers
  const toggleTemplatePicker = () => {
    setIsTemplatePickerOpen(!isTemplatePickerOpen);
  };
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const chatContainerVariants = {
    open: { height: "500px", width: "500px" },
    closed: {
      height: "0px",
      width: "0px",
    },
  };

  const resetProject = () => {
    setCurrentProjectId(null);
    setProjectTitleInputValue("");
    sandpack.resetAllFiles();
  };

  // project CRUD
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
      const currentProjects =
        JSON.parse(localStorage.getItem("projects")) || [];
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
    setSavedCreations((prevCreations) =>
      prevCreations.filter((creation) => creation.id !== id)
    );

    // sync with local storage
    const updatedProjects = savedCreations.filter(
      (creation) => creation.id !== id
    );
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
  };

  const loadProject = (projectId) => {
    // get project from state
    const project = savedCreations.find(
      (creation) => creation.id === projectId
    );

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

  useEffect(() => {
    const handleChatbotShortcut = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "b") {
        event.preventDefault();
        setIsChatOpen(!isChatOpen);
      }
    };

    document.addEventListener("keydown", handleChatbotShortcut);
    return () => {
      document.removeEventListener("keydown", handleChatbotShortcut);
    };
  }, [isChatOpen]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "m") {
        event.preventDefault();
        setIsMenuOpen((prevState) => !prevState);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const memoizedCurrentProject = useMemo(() => {
    return savedCreations.find((creation) => creation.id === currentProjectId);
  }, [currentProjectId, savedCreations]);

  const shortcutBage = () => {};

  return (
    <div className="flex h-screen w-full gap-2 p-2 transition-all dark:bg-slate-800">
      <Sidebar
        isMenuOpen={isMenuOpen}
        toggleMenu={toggleMenu}
        savedCreations={savedCreations}
        onProjectClick={loadProject}
        onRemoveClick={removeProject}
        currentProjectId={currentProjectId}
      />
      {/* left column */}
      <div className="relative grid flex-1">
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
      <div className="flex h-full flex-1 flex-col gap-2 ">
        {/* top right container */}
        <div className="preview h-full flex-1 overflow-hidden rounded-lg border dark:border-slate-500">
          <Preview />
        </div>
        {/* bottom right container */}
        {isChatOpen && <Chat messages={messages} setMessages={setMessages} />}
        {/* floating chat button */}
        <button
          className="absolute bottom-[20px] right-[20px] z-[999]  rounded-full bg-white px-3 py-1 shadow-md focus:outline-none dark:bg-slate-800"
          onClick={toggleChat}
        >
          <p className="text-muted-foreground text-lg">
            <ShortcutBadge /> + b
          </p>
        </button>
      </div>
    </div>
  );
}

const ShortcutBadge = () => {
  const isBrowser = typeof window !== "undefined";
  const isMac =
    isBrowser && window.navigator.platform.toUpperCase().indexOf("MAC") >= 0;

  return isMac ? "⌘" : "^";
};
