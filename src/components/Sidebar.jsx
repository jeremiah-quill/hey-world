import { RxCaretRight } from "react-icons/rx";
import { SavedList } from "./SavedList";
import { useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";
import { BiUser } from "react-icons/bi";
import { Modal } from "@/components/Modal";
import useModal from "@/hooks/useModal";
import { useState } from "react";
import Link from "next/link";

export function Sidebar({
  isMenuOpen,
  toggleMenu,
  savedCreations = [],
  onProjectClick,
  onRemoveClick,
  currentProjectId,
}) {
  const { data: session } = useSession();
  const {
    modalIsOpen,
    modalContent,
    modalTitle,
    modalOnSubmit,
    openModal,
    closeModal,
  } = useModal();

  return (
    <>
      <div
        className="flex h-full max-h-screen flex-col rounded-lg border"
        style={{ width: isMenuOpen ? "20%" : "50px" }}
      >
        {isMenuOpen && (
          <div className="flex-1 overflow-y-auto">
            {savedCreations?.length > 0 ? (
              <SavedList
                className="h-full overflow-y-auto"
                savedCreations={savedCreations}
                onProjectClick={onProjectClick}
                onRemoveClick={onRemoveClick}
                currentProjectId={currentProjectId}
              />
            ) : (
              <div className="p-4 font-extrabold">No saved creations.</div>
            )}
          </div>
        )}
        <div className="mt-auto w-full">
          <div className=" max-w-[50 px] mt-auto grid p-2">
            <div className="my-2 grid gap-2">
              {session?.user ? (
                <button
                  onClick={() =>
                    openModal({
                      content: <UserSettings />,
                      title: null,
                      onSubmit: null,
                    })
                  }
                >
                  <img
                    src={session.user.image}
                    className="max-w-[32px] rounded-full"
                  />
                </button>
              ) : (
                <button onClick={() => signIn()}>
                  <BiUser className="rounded-full bg-black p-1 text-2xl text-white" />
                </button>
              )}
            </div>
            {/* popout button */}
            <button
              onClick={() => toggleMenu()}
              className={isMenuOpen ? "mr-auto" : ""}
            >
              {
                <RxCaretRight
                  className={`text-3xl transition-all ${
                    isMenuOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              }
            </button>
          </div>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onClose={closeModal}
        title={modalTitle}
        onSubmit={modalOnSubmit}
      >
        {modalContent}
      </Modal>
    </>
  );
}

const UserModal = ({ user }) => {
  return (
    <div>
      <div>hey {user.name}. Check back soon for personalized settings:</div>
      <ul
        className="
        my-2
        list-inside
        list-disc
        text-left
        text-sm
        font-light
        
      "
      >
        <li className="font-bold">gpt code editor context (pro)</li>
        <li className="font-bold">
          save code snippets to db instead of local storage (pro)
        </li>
        <li>dark mode</li>
        <li>VIM mode</li>
        <li>custom keybindings</li>
        <li>preferred template</li>
      </ul>
      <button
        className="
        mr-2
        rounded
        bg-gray-300
        px-4
        py-2
        font-semibold
        text-black
        hover:bg-gray-400
        focus:outline-none
        focus:ring-2
        focus:ring-gray-600
        focus:ring-opacity-50"
        onClick={() => signOut()}
      >
        Sign out
      </button>
    </div>
  );
};

import { useUserSettings } from "@/context/userSettingsContext";

function UserSettings() {
  // const handleDarkModeToggle = () => {
  //   toggleSetting("isDarkModeEnabled");
  // };
  const handleVimModeToggle = () => {
    toggleSetting("isVimModeEnabled");
  };
  // const handleEmmetToggle = () => {
  //   toggleSetting("isEmmetEnabled");
  // };
  // const handleAutoCompleteToggle = () => {
  //   toggleSetting("isAutoCompleteEnabled");
  // };
  // const handleLivePreviewToggle = () => {
  //   toggleSetting("isLivePreviewEnabled");
  // };
  // const handleLineWrappingToggle = () => {
  //   toggleSetting("isLineWrappingEnabled");
  // };

  const { userSettings, toggleSetting } = useUserSettings();

  const handleTemplateChange = (event) => {
    setPreferredTemplate(event.target.value);
  };

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <h2 className="mb-6 text-2xl font-semibold">Settings</h2>
        {/* <ul>
          <li
            className="
          list-disc
          list-inside
          text-left
          my-2
          text-sm
          font-light
          ">
            Code editor context aware chatbot
          </li>
          <li
            className="
          list-disc
          list-inside
          text-left
          my-2
          text-sm
          font-light
          ">
            Store in DB vs. local storage
          </li>
          <li
            className="
          list-disc
          list-inside
          text-left
          my-2
          text-sm
          font-light
          ">
            Dark mode
          </li>
          <li
            className="
          list-disc
          list-inside
          text-left
          my-2
          text-sm
          font-light
          ">
            Vim mode
          </li>
          <li
            className="
          list-disc
          list-inside
          text-left
          my-2
          text-sm
          font-light
          ">
            Keyboard shortcuts
          </li>
          <li
            className="
          list-disc
          list-inside
          text-left
          my-2
          text-sm
          font-light
          ">
            Favorites
          </li>
        </ul>
        <Link
          href="/feature-roadmap"
          className="
          mt-6
          inline-block
        bg-gray-300
        text-black
        font-semibold
        py-2
        px-4
        rounded
        mr-2
        hover:bg-gray-400
        focus:outline-none
        focus:ring-2
        focus:ring-gray-600
        focus:ring-opacity-50

        ">
          Request a feature
        </Link> */}

        <div className="mb-6  flex items-center space-x-2">
          <input
            type="checkbox"
            checked={userSettings.isVimModeEnabled}
            onChange={handleVimModeToggle}
            className="form-checkbox h-4 w-4 rounded text-blue-500 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
          />
          <label className="text-gray-600">Vim Mode</label>
        </div>
        {/* <div className="mb-6">
          <label className="block text-gray-600 mb-2">Dark Mode</label>
          <input
            type="checkbox"
            checked={userSettings.isDarkModeEnabled}
            onChange={handleDarkModeToggle}
            className="focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
          />
        </div> */}
        {/* <div className="mb-6">
          <label className="block text-gray-600 mb-2">Preferred Template</label>
          <select
            value={preferredTemplate}
            onChange={handleTemplateChange}
            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 rounded">
            <option value="">Select a template</option>
            <option value="template1">Template 1</option>
            <option value="template2">Template 2</option>
            <option value="template3">Template 3</option>
          </select>
        </div> */}
        {/* <button
          className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
          onClick={() => {
          }}>
          Save Settings
        </button> */}
      </div>
    </div>
  );
}
