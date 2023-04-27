import React, { useState } from "react";

import { SandpackProvider } from "@codesandbox/sandpack-react";

import { editorConfigObject } from "@/constants";
import { App } from "@/components/App";

// get the OpenAI API key from the environment variables or return null
export async function getServerSideProps() {
  return {
    props: {
      serverKey: process.env.OPENAI_API_KEY || null,
    },
  };
}

export default function Home({ serverKey }) {
  const [currentTemplate, setCurrentTemplate] = useState("React"); // TODO: review this, but I think I like it

  return (
    <SandpackProvider
      key={currentTemplate}
      template={editorConfigObject[currentTemplate].templateName}
      files={editorConfigObject[currentTemplate].files}>
      <App serverKey={serverKey} currentTemplate={currentTemplate} setCurrentTemplate={setCurrentTemplate} />
    </SandpackProvider>
  );
}
