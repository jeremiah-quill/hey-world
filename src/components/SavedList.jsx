export function SavedList({ className = "", savedCreations = [], onProjectClick, onRemoveClick, currentProjectId }) {
  return (
    <ul className={`${className}`}>
      {savedCreations.map((item, idx) => (
        <li
          className={`p-2 flex items-center justify-between min-h-[40px] ${
            currentProjectId === item.id && "bg-slate-200"
          }`}
          key={idx}>
          <button className="truncate underline hover:opacity-50" onClick={() => onProjectClick(item.id)}>
            {item.name}
          </button>
          <button className="ml-4 text-red-500 hover:opacity-50" onClick={(e) => onRemoveClick(item.id, e)}>
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
}
