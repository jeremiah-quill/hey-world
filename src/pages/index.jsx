import React, { useState } from "react";

import { SandpackProvider } from "@codesandbox/sandpack-react";

import { editorConfigObject } from "@/constants";
import { App } from "@/components/App";
import { UserSettingsProvider } from "@/context/userSettingsContext";
import { dracula } from "@codesandbox/sandpack-themes";

import { getSession } from "next-auth/react";

// get the OpenAI API key from the environment variables or return null
export async function getServerSideProps({ context }) {
  const session = await getSession(context);

  return {
    props: {
      serverKey: session ? process.env.OPENAI_API_KEY : null,
    },
  };
}

export default function Home({ serverKey }) {
  const [currentTemplate, setCurrentTemplate] = useState("React"); // TODO: review this, but I think I like it

  return (
    <UserSettingsProvider>
      <SandpackProvider
        // theme={dracula}
        key={currentTemplate}
        template={editorConfigObject[currentTemplate].templateName}
        files={editorConfigObject[currentTemplate].files}
      >
        <App
          serverKey={serverKey}
          currentTemplate={currentTemplate}
          setCurrentTemplate={setCurrentTemplate}
        />
      </SandpackProvider>
    </UserSettingsProvider>
  );
}
