export function SavedList({
  className = "",
  savedCreations = [],
  onProjectClick,
  onRemoveClick,
  currentProjectId,
}) {
  return (
    <ul className={`${className}`}>
      {savedCreations.map((item, idx) => (
        <li
          className={`flex min-h-[40px] items-center justify-between p-2 ${
            currentProjectId === item.id && "bg-slate-200 dark:bg-slate-600"
          }`}
          key={idx}
        >
          <button
            className="truncate underline hover:opacity-50"
            onClick={() => onProjectClick(item.id)}
          >
            {item.name}
          </button>
          <button
            className="ml-4 text-red-500 hover:opacity-50"
            onClick={(e) => onRemoveClick(item.id, e)}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
