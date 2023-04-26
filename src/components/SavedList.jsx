export function SavedList({ className = "", savedItems = [...Array(100)] }) {
  return (
    <ul className={`${className}`}>
      {savedItems.map((item) => (
        <li className="p-4 border-b">test item</li>
      ))}
    </ul>
  );
}
