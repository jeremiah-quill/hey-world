import { SandpackCodeEditor } from "@codesandbox/sandpack-react";
// import { vim } from "@replit/codemirror-vim";

export function Editor() {
  return (
    <SandpackCodeEditor
      // wrapContent={true}
      showLineNumbers
      showInlineErrors
      style={{ height: "100%" }}
      // extensions={[vim()]}
    />
  );
}
