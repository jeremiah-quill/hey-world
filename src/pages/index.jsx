import React, { useState } from "react";

import { SandpackProvider } from "@codesandbox/sandpack-react";

import { App } from "@/components/App";
import { useUserSettings } from "@/context/userSettingsContext";
import { editorConfigObject } from "@/constants";

export default function Home() {
  const { userSettings } = useUserSettings();
  const [currentTemplate, setCurrentTemplate] = useState("React"); // TODO: review this, but I think I like it

  return (
    <SandpackProvider
      theme={userSettings.isDarkModeEnabled ? "dark" : "light"}
      key={currentTemplate}
      template={editorConfigObject[currentTemplate].templateName}
      files={editorConfigObject[currentTemplate].files}
      options={
        currentTemplate === "HTML"
          ? {}
          : {
              externalResources: ["https://cdn.tailwindcss.com"],
            }
      }
      customSetup={{
        dependencies: {
          "react-icons": "latest",
          "framer-motion": "latest",
        },
      }}
    >
      <App
        currentTemplate={currentTemplate}
        setCurrentTemplate={setCurrentTemplate}
      />
    </SandpackProvider>
  );
}
