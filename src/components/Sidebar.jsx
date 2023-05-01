import { RxCaretRight } from "react-icons/rx";
import { SavedList } from "./SavedList";
import { useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";
import { BiUser } from "react-icons/bi";
import { Modal } from "@/components/Modal";
import useModal from "@/hooks/useModal";

export function Sidebar({
  isMenuOpen,
  toggleMenu,
  savedCreations = [],
  onProjectClick,
  onRemoveClick,
  currentProjectId,
}) {
  const { data: session } = useSession();
  const { modalIsOpen, modalContent, modalTitle, modalOnSubmit, openModal, closeModal } = useModal();

  return (
    <>
      <div
        className="h-full flex flex-col max-h-screen border rounded-lg"
        style={{ width: isMenuOpen ? "20%" : "50px" }}>
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
        <div className="bg-slate-200 mt-auto p-2 grid place-items-center">
          <div className="grid gap-2 my-2">
            {session?.user ? (
              <button
                onClick={() =>
                  openModal({
                    content: session?.user ? <UserModal user={session.user} /> : "not signed in",
                    title: null,
                    onSubmit: null,
                  })
                }>
                <img src={session.user.image} className="rounded-full max-w-[32px]" />
              </button>
            ) : (
              <button onClick={() => signIn()}>
                <BiUser className="bg-black rounded-full text-white p-1 text-2xl" />
              </button>
            )}
          </div>
          {/* popout button */}
          <button onClick={() => toggleMenu()} className={isMenuOpen ? "mr-auto" : ""}>
            {<RxCaretRight className={`text-3xl transition-all ${isMenuOpen ? "rotate-180" : "rotate-0"}`} />}
          </button>
        </div>
      </div>
      <Modal isOpen={modalIsOpen} onClose={closeModal} title={modalTitle} onSubmit={modalOnSubmit}>
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
        list-disc
        list-inside
        text-left
        my-2
        text-sm
        font-light
        
      ">
        <li className="font-bold">gpt code editor context (pro)</li>
        <li className="font-bold">save code snippets to db instead of local storage (pro)</li>
        <li>dark mode</li>
        <li>VIM mode</li>
        <li>custom keybindings</li>
        <li>preferred template</li>
      </ul>
      <button
        className="
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
        focus:ring-opacity-50"
        onClick={() => signOut()}>
        Sign out
      </button>
    </div>
  );
};
