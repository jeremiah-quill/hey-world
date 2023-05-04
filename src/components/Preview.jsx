import React from "react";
import {
  SandpackLayout, // fix this hack: SandpackPreview won't leave loading state without being wrapped in SandpackLayout
  SandpackPreview,
} from "@codesandbox/sandpack-react";

export function Preview() {
  return (
    <SandpackLayout>
      <SandpackPreview
        showRefreshButton={false}
        showOpenInCodeSandbox={false}
      />
    </SandpackLayout>
  );
}
