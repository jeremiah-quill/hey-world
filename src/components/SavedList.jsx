export function SavedList({ className = "", savedItems = [] }) {
  return (
    <ul className={`${className}`}>
      {savedItems.map((item, idx) => (
        <li className="p-4 border-b" key={idx}>
          test item
        </li>
      ))}
    </ul>
  );
}
