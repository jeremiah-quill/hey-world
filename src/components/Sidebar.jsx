import { RxCaretRight } from "react-icons/rx";
import { SavedList } from "./SavedList";
import { useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";
import { BiUser } from "react-icons/bi";
import { Modal } from "@/components/Modal";
import useModal from "@/hooks/useModal";
import { useUserSettings } from "@/context/userSettingsContext";

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

function UserSettings() {
  const { userSettings, toggleSetting } = useUserSettings();

  // const handleDarkModeToggle = () => {
  //   toggleSetting("isDarkModeEnabled");
  // };
  const handleVimModeToggle = () => {
    toggleSetting("isVimModeEnabled");
  };

  const handleTemplateChange = (event) => {
    setPreferredTemplate(event.target.value);
  };

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <h2 className="mb-6 text-2xl font-semibold">Settings</h2>

        <div className="mb-6  flex items-center space-x-2">
          <input
            type="checkbox"
            checked={userSettings.isVimModeEnabled}
            onChange={handleVimModeToggle}
            className="form-checkbox h-4 w-4 rounded text-blue-500 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
          />
          <label className="text-gray-600">Vim Mode</label>
        </div>
      </div>
    </div>
  );
}
