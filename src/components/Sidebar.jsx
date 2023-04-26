import { RxCaretRight } from "react-icons/rx";

export function Sidebar({ isMenuOpen, toggleMenu, savedCreations }) {
  return (
    <div className="h-full flex flex-col max-h-screen border-2" style={{ width: isMenuOpen ? "20%" : "50px" }}>
      {isMenuOpen && (
        <div className="flex-1 overflow-y-auto">
          {savedCreations.length > 0 ? (
            <SavedList className="h-full overflow-y-auto" savedCreations={savedCreations} />
          ) : (
            <div className="p-4 font-extrabold">No saved creations.</div>
          )}
        </div>
      )}
      <div className="bg-slate-200 mt-auto p-2 grid place-items-center">
        <button onClick={() => toggleMenu()} className={isMenuOpen ? "mr-auto" : ""}>
          {<RxCaretRight className={`text-3xl transition-all ${isMenuOpen ? "rotate-180" : "rotate-0"}`} />}
        </button>
      </div>
    </div>
  );
}
