import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useSandpack } from "@codesandbox/sandpack-react";
import { v4 as uuid } from "uuid";

import { editorConfigObject } from "@/constants";
import { Chat } from "@/components/Chat";
import { Preview } from "@/components/Preview";
import { Editor } from "@/components/Editor";
import { Sidebar } from "@/components/Sidebar";
import { AccessChat } from "@/components/AccessChat";
import { CurrentProjectBar } from "@/components/CurrentProjectBar";
import { useSession } from "next-auth/react";
import { useUserSettings } from "@/context/userSettingsContext";
import Draggable from "react-draggable"; // The default

// TODO: extract logic to custom hook
export function App({ currentTemplate, setCurrentTemplate }) {
  const { sandpack } = useSandpack(); // used to get current files, and switch view when loading a project
  const [projectTitleInputValue, setProjectTitleInputValue] = useState("");

  const [messages, setMessages] = useState([]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false); // TODO: remove this, use [key, session instead] -> what does this mean???
  const [isTemplatePickerOpen, setIsTemplatePickerOpen] = useState(false);

  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [savedCreations, setSavedCreations] = useState([]);

  const { data: session } = useSession();
  const { key } = useUserSettings();

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
    open: { height: "50%" },
    closed: { height: "50px" },
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

  const memoizedCurrentProject = useMemo(() => {
    return savedCreations.find((creation) => creation.id === currentProjectId);
  }, [currentProjectId, savedCreations]);

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
        {isChatOpen && (
          <Draggable>
            <motion.div
              className="absolute bottom-[50px] right-[50px]  h-[500px] w-[500px] shadow-inner dark:border-slate-500"
              initial={false}
              animate={isChatOpen ? "open" : "closed"}
              variants={chatContainerVariants}
              transition={{ duration: 0.35, ease: "backOut" }}
            >
              <div className="flex h-full flex-col rounded-lg border bg-slate-100 p-4 text-slate-800  dark:border-slate-500 dark:bg-slate-800 dark:text-slate-300">
                <>
                  {key || session ? (
                    <Chat
                      isChatOpen={isChatOpen}
                      messages={messages}
                      setMessages={setMessages}
                    />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center">
                      <AccessChat />
                    </div>
                  )}
                </>
              </div>
            </motion.div>
          </Draggable>
        )}
        <button
          className="absolute bottom-[20px] right-[20px] z-[999] h-[50px] w-[50px]  rounded-full bg-white px-3 py-1 shadow-md focus:outline-none dark:bg-slate-800"
          onClick={toggleChat}
        >
          {/* {isChatOpen ? "Close" : "Open"} */}
        </button>
      </div>
    </div>
  );
}
