import React, { useState } from "react";

import { SandpackProvider } from "@codesandbox/sandpack-react";

import { App } from "@/components/App";
import { useUserSettings } from "@/context/userSettingsContext";
import { editorConfigObject } from "@/constants";

// get the OpenAI API key from the environment variables or return null
// export async function getServerSideProps({ context }) {
//   const session = await getSession(context);

//   return {
//     props: {
//       serverKey: session ? process.env.OPENAI_API_KEY : null,
//     },
//   };
// }

export default function Home() {
  const { userSettings } = useUserSettings();
  const [currentTemplate, setCurrentTemplate] = useState("React"); // TODO: review this, but I think I like it

  return (
    <SandpackProvider
      theme={userSettings.isDarkModeEnabled ? "dark" : "light"}
      key={currentTemplate}
      template={editorConfigObject[currentTemplate].templateName}
      files={editorConfigObject[currentTemplate].files}
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
