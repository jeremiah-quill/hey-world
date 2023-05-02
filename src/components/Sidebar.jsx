import { RxCaretRight } from "react-icons/rx";
import { SavedList } from "./SavedList";
import { useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";
import { BiUser } from "react-icons/bi";
import { Modal } from "@/components/Modal";
import useModal from "@/hooks/useModal";
import { useUserSettings } from "@/context/userSettingsContext";
import { FiSun, FiMoon } from "react-icons/fi";
import { useEffect, useState } from "react";

export function Sidebar({
  isMenuOpen,
  toggleMenu,
  savedCreations = [],
  onProjectClick,
  onRemoveClick,
  currentProjectId,
}) {
  const { data: session } = useSession();
  const [themeModeIcon, setThemeModeIcon] = useState(<FiSun />);
  const {
    modalIsOpen,
    modalContent,
    modalTitle,
    modalOnSubmit,
    openModal,
    closeModal,
  } = useModal();

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
      <div
        className="flex h-full max-h-screen flex-col rounded-lg border text-slate-800 dark:border-slate-500 dark:text-slate-300"
        style={{ width: isMenuOpen ? "20%" : "50px" }}
      >
        {isMenuOpen && (
          <div className="flex-1 overflow-y-auto">
            {savedCreations?.length > 0 ? (
              <SavedList
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
        <div className="mt-auto grid w-full place-items-start">
          <div className="mt-auto grid place-items-center gap-4 p-2">
            <button
              onClick={handleDarkModeToggle}
              className="mx-auto text-2xl dark:text-slate-300"
            >
              {themeModeIcon}
            </button>
            {/* <div className="grid gap-2"> */}
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
            <button></button>
            {/* </div> */}
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
    <div className="dark:slate-text-300 flex items-center justify-center">
      <div className="shado w-full max-w-md space-y-4 rounded bg-white p-6 dark:bg-slate-800">
        <h2 className="text-2xl font-semibold">Settings</h2>

        {!session && (
          <div className="rounded border border-red-500 p-2 text-sm text-red-500">
            Warning: You must be logged in for changes to be saved to your
            browser
          </div>
        )}

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
    </div>
  );
}
