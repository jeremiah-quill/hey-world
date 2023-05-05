export const ShortcutBadge = ({ children }) => {
  const isBrowser = typeof window !== "undefined";
  const isMac =
    isBrowser && window.navigator.platform.toUpperCase().indexOf("MAC") >= 0;

  // return <p className="text-muted-foreground text-lg"></p>;

  return (
    <p className="text-muted-foreground flex flex gap-1 gap-1 text-lg">
      {isMac ? "⌘" : "^"}
      {children}
    </p>
  );
};
