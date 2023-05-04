import React, { useState } from "react";

import { SandpackProvider } from "@codesandbox/sandpack-react";

import { editorConfigObject } from "@/constants";
import { App } from "@/components/App";
import { dracula } from "@codesandbox/sandpack-themes";

import { getSession } from "next-auth/react";
import { useUserSettings } from "@/context/userSettingsContext";

// get the OpenAI API key from the environment variables or return null
// export async function getServerSideProps({ context }) {
//   const session = await getSession(context);

//   return {
//     props: {
//       serverKey: session ? process.env.OPENAI_API_KEY : null,
//     },
//   };
// }
import useModal from "@/hooks/useModal";
import { Modal } from "@/components/Modal";

export default function Home() {
  const [currentTemplate, setCurrentTemplate] = useState("React"); // TODO: review this, but I think I like it

  const { userSettings } = useUserSettings();
  const {
    modalIsOpen,
    modalContent,
    modalTitle,
    modalOnSubmit,
    openModal,
    closeModal,
  } = useModal();

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
        openModal={openModal}
        closeModal={closeModal}
      />
      <Modal
        className="fixed"
        isOpen={modalIsOpen}
        onClose={closeModal}
        title={modalTitle}
        onSubmit={modalOnSubmit}
        modalContent={modalContent}
      >
        {/* {modalContent} */}
      </Modal>
    </SandpackProvider>
  );
}
