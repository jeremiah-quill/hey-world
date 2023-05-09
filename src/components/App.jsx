import React, { useState, useEffect, useMemo } from "react";

import { useSandpack } from "@codesandbox/sandpack-react";
import { v4 as uuid } from "uuid";

import { editorConfigObject } from "@/constants";
import { Chat } from "@/components/Chat";
import { Preview } from "@/components/Preview";
import { Editor } from "@/components/Editor";
import { Sidebar } from "@/components/Sidebar";
import { FileMenuBar } from "@/components/FileMenuBar";

// TODO: extract logic to custom hook
export function App({ currentTemplate, setCurrentTemplate }) {
  // state
  const { sandpack } = useSandpack(); // used to get current files, and switch view when loading a project

  // project state
  const [projectTitleInputValue, setProjectTitleInputValue] =
    useState("untitled");
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

  const saveAs = () => {
    // create new project
    const id = uuid();
    const project = {
      templateName: currentTemplate,
      id: id,
      code: sandpack.files,
      name: projectTitleInputValue,
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
  };

  const newProject = () => {
    setProjectTitleInputValue("untitled");
    // save existing project
    if (currentProjectId) {
      saveProject();
    }

    // create new project
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
  };

  // project CRUD
  const saveProject = () => {
    if (!currentProjectId) {
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
        if (creation.id === currentProjectId) {
          const updatedCreation = {
            ...creation,
            code: sandpack.files,
            name: projectTitleInputValue,
          };
          return updatedCreation;
        } else {
          return creation;
        }
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
    setProjectTitleInputValue(project.name);
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

  // SAVE
  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        // console.log("in save regular");
        e.preventDefault();

        if (e.shiftKey) {
          // console.log("in save as");
          saveAs();
        } else {
          saveProject();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [currentProjectId, projectTitleInputValue, saveProject]);

  // NEW
  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "n") {
        e.preventDefault();
        newProject();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [currentProjectId, projectTitleInputValue, saveProject]);

  const menuItems = [
    {
      title: "File",
      options: [
        {
          name: "New",
          shortcut: "Cmd+N",
          onClick: () => saveProject(memoizedCurrentProject),
        },
        {
          name: "Save",
          shortcut: "Cmd+S",
          onClick: () => saveProject(currentProjectId),
        },
        {
          name: "Save As",
          shortcut: "Cmd+Shift+S",
          onClick: () => saveProject(),
        },
      ],
    },
  ];

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
          <FileMenuBar
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
            menuItems={menuItems}
          />
        </Editor>
      </div>
      {/* right column */}
      <div className="flex h-full flex-1 flex-col gap-2 ">
        {/* top right container */}
        <div className="preview flex-1 overflow-hidden rounded-lg border dark:border-slate-500">
          <Preview />
        </div>
        {/* bottom right container */}
        {isChatOpen && (
          <Chat
            setIsChatOpen={setIsChatOpen}
            isChatOpen={isChatOpen}
            messages={messages}
            setMessages={setMessages}
          />
        )}
        {/* floating chat button */}
        <button
          className="absolute bottom-[20px] right-[20px] z-[999]  rounded-full bg-white px-3 py-1 shadow-md hover:bg-slate-300 focus:outline-none dark:bg-slate-700 hover:dark:bg-slate-500"
          onClick={toggleChat}
        >
          <div className="text-3xl">🤖</div>
        </button>
      </div>
    </div>
  );
}
