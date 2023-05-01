import { SandpackCodeEditor, SandpackFileExplorer } from "@codesandbox/sandpack-react";
import { useSandpack, useActiveCode } from "@codesandbox/sandpack-react";
import prettier from "prettier";
import parserBabel from "prettier/parser-babel";
import { useCallback, useEffect, useRef } from "react";

export function Editor({ children }) {
  const codemirrorInstance = useRef(); // use a ref to access codemirror instance so we can trigger code formatting with prettier
  return (
    <div className="rounded-lg overflow-hidden border editor relative flex-1">
      {children}
      <SandpackCodeEditor ref={codemirrorInstance} showLineNumbers showInlineErrors style={{ height: "100%" }} />
      <ActivatePrettier codemirrorInstance={codemirrorInstance} />
    </div>
  );
}

// TODO: this could also return a button that triggers the formatting.  can it do both?
const ActivatePrettier = ({ codemirrorInstance }) => {
  const { sandpack } = useSandpack();
  const activeCode = useActiveCode();

  const formatCode = useCallback(() => {
    if (activeCode.code) {
      try {
        const formatted = prettier.format(activeCode.code, {
          parser: "babel",
          plugins: [parserBabel],
        });

        const cmInstance = codemirrorInstance?.current.getCodemirror();

        if (cmInstance) {
          const trans = cmInstance.state.update({
            selection: cmInstance.state.selection,
            changes: {
              from: 0,
              to: cmInstance.state.doc.length,
              insert: formatted,
            },
          });

          cmInstance.update([trans]);
        }

        sandpack.updateFile(sandpack.activePath, formatted);
      } catch {}
    }
  }, [activeCode.code, codemirrorInstance, sandpack]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        formatCode();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [formatCode]);

  return null;
};
