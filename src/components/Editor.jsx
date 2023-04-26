import CodeMirror from "@uiw/react-codemirror";
import { EditorView } from "codemirror";

export function Editor({ value, theme, extensions, onChange }) {
  return (
    <CodeMirror
      value={value}
      className="h-full"
      height="100%"
      width="100%"
      theme={theme}
      extensions={[...extensions, EditorView.lineWrapping]}
      onChange={onChange}
    />
  );
}
