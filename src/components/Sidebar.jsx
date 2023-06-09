import { RxCaretRight } from "react-icons/rx";
import { SavedList } from "./SavedList";
import { useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";
import { BiUser } from "react-icons/bi";
import { useUserSettings } from "@/context/userSettingsContext";
import { FiSun, FiMoon } from "react-icons/fi";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useModal } from "@/context/modalContext";

// TODO: extract logic to custom hook
export function Sidebar({
  isMenuOpen,
  toggleMenu,
  savedSnippets = [],
  onSnippetClick,
  onRemoveClick,
  currentSnippetId,
}) {
  const { openModal } = useModal();
  const { data: session } = useSession();
  const [themeModeIcon, setThemeModeIcon] = useState(<FiSun />);

  const { userSettings, toggleSetting } = useUserSettings();

  useEffect(() => {
    if (userSettings.isDarkModeEnabled) {
      setThemeModeIcon(<FiMoon />);
    } else {
      setThemeModeIcon(<FiSun />);
    }
  }, [userSettings.isDarkModeEnabled]);

  const handleDarkModeToggle = () => {
    toggleSetting("isDarkModeEnabled");
  };

  return (
    <>
      <motion.div
        animate={{ width: isMenuOpen ? "20%" : "50px" }}
        className="flex h-full max-h-screen flex-col rounded-lg border text-slate-800 dark:border-slate-500 dark:text-slate-300"
      >
        {isMenuOpen && (
          <div className="flex-1 overflow-y-auto">
            {savedSnippets?.length > 0 ? (
              <SavedList
                savedSnippets={savedSnippets}
                onSnippetClick={onSnippetClick}
                onRemoveClick={onRemoveClick}
                currentSnippetId={currentSnippetId}
              />
            ) : (
              <div className="p-4 font-extrabold">No saved snippets.</div>
            )}
          </div>
        )}
        <div className="mt-auto grid w-full place-items-start">
          <div className="mt-auto grid place-items-center gap-4 p-2">
            <button
              onClick={handleDarkModeToggle}
              className="mx-auto text-2xl dark:text-slate-300"
            >
              {themeModeIcon}
            </button>
            <button
              onClick={() =>
                openModal({
                  content: <UserSettings />,
                  title: null,
                  onSubmit: null,
                })
              }
            >
              {session?.user ? (
                <img
                  src={session.user.image}
                  className="max-w-[24px] rounded-full"
                />
              ) : (
                <BiUser className="mx-auto rounded-full bg-slate-800 p-1 text-2xl text-slate-300 dark:bg-slate-300 dark:text-slate-800" />
              )}
            </button>
            {/* popout button */}
            <button
              onClick={() => toggleMenu()}
              className={`mx-auto border-t pt-4 text-slate-800 dark:text-slate-300 ${
                isMenuOpen ? "mr-auto" : ""
              }`}
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
      </motion.div>
    </>
  );
}

function UserSettings() {
  const { userSettings, toggleSetting } = useUserSettings();

  const handleDarkModeToggle = () => {
    toggleSetting("isDarkModeEnabled");
  };
  const handleVimModeToggle = () => {
    toggleSetting("isVimModeEnabled");
  };
  const { data: session } = useSession();
  return (
    <motion.div className="dark:slate-text-300 flex items-center justify-center">
      <div className="shado w-full max-w-md space-y-4 rounded bg-white p-6 dark:bg-slate-800">
        <h2 className="text-2xl font-semibold">Settings</h2>

        {/* {!session && (
          <div className="rounded border border-red-500 p-2 text-sm text-red-500">
            Warning: You must be logged in for changes to be saved to your
            browser
          </div>
        )} */}

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={userSettings.isVimModeEnabled}
            onChange={handleVimModeToggle}
            className="form-checkbox h-4 w-4 rounded text-blue-500 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
          />
          <label className="">Vim Mode</label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={userSettings.isDarkModeEnabled}
            onChange={handleDarkModeToggle}
            className="form-checkbox h-4 w-4 rounded text-blue-500 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
          />
          <label className="">Dark Mode</label>
        </div>
        <div className="mt-6 flex justify-center">
          <button
            onClick={session ? () => signOut() : () => signIn()}
            className={`${
              session ? "bg-red-500" : "bg-blue-500"
            } rounded px-4 py-2 font-semibold text-white focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50`}
          >
            {session ? "Sign Out" : "Sign In"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
