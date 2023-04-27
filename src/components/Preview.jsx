import React from "react";
import {
  SandpackLayout, // fix this hack: SandpackPreview won't leave loading state without being wrapped in SandpackLayout
  SandpackPreview,
  useSandpack,
} from "@codesandbox/sandpack-react";

export function Preview() {
  const { error } = useSandpack();

  if (error) {
    console.log("error", error);
  }

  return (
    <SandpackLayout>
      <SandpackPreview />
    </SandpackLayout>
  );
}
