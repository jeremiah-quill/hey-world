export const defaultJsx = `import React, { useState } from "react";

export default function App() {
  console.log("hey world from react");

  return (
    <div className="h-screen flex flex-col">
      <header className="h-screen flex flex-col items-center justify-center bg-green-500">
        <div className="w-full p-4">
          <div className="flex">
            <div className="flex-1 flex items-end justify-center">
              <h1 className="text-white text-8xl font-black">
                ✌️ hey
                <br></br> world.
              </h1>
            </div>
            <div className="flex-1 grid place-items-center bg-white bg-opacity-60 p-4 rounded-lg">
              <Features />
            </div>
          </div>
          <div className="text-center text-3xl font-bold mb-16 mt-8">
            build <span className="bg-white bg-opacity-60 p-1 rounded">UI</span>{" "}
            with the help of{" "}
            <span className="bg-white bg-opacity-60 p-1 rounded">AI</span>
          </div>
          <div className="grid place-items-center opacity-60 absolute right-3 bottom-20">
            <ul className="grid gap-2">
              <li className="flex items-center justify-end gap-2">
                <div>chatbot</div>
                <ShortcutBadge> + b</ShortcutBadge>{" "}
              </li>
              <li className="flex items-center justify-end gap-2">
                <div>menu</div>
                <ShortcutBadge> + m</ShortcutBadge>
              </li>
              <li className="flex items-center justify-end gap-2">
                <div>save</div>
                <ShortcutBadge> + s</ShortcutBadge>
              </li>
              <li className="flex items-center justify-end gap-2">
                <div>save as</div>
                <ShortcutBadge> + ^ + s</ShortcutBadge>
              </li>
              <li className="flex items-center justify-end gap-2">
                <div>new</div>
                <ShortcutBadge> + n</ShortcutBadge>
              </li>
              <li className="flex items-center justify-end gap-2">
                <div>format</div>
                <ShortcutBadge> + p</ShortcutBadge>
              </li>
            </ul>
          </div>
        </div>
      </header>
      <Hands />
    </div>
  );
}

function Features() {
  return (
    <ul className="grid gap-2 text-lg font-bold">
      <li>✅ lightweight browser editor + preview</li>
      <li className="flex items-center space-x-2">
        <div>✅ prettier formatting</div>
      </li>
      <li>✅ save, update, & delete snippets</li>
      <li>✅ react + html templates</li>
      <li>✅ ai chatbot</li>
      <li>
        🚀{" "}
        <a
          href="https://hey-world.dev/feature-roadmap"
          className="hover:opacity-50"
        >
          feature roadmap
        </a>
      </li>
      <li>
        🐛{" "}
        <a href="https://hey-world.dev/bug-report" className="hover:opacity-50">
          report a bug
        </a>
      </li>
    </ul>
  );
}

function Hands() {
  return (
    <>
      <div className="text-3xl font-bold fixed bottom-4 left-2 flex items-center space-x-2">
        <div className="hand">👈</div>
        <h2>tinker</h2>
      </div>
      <div className="text-3xl font-bold fixed bottom-4 right-[75px] flex items-center space-x-2">
        <h2>chat</h2>
        <div className="hand">👉</div>
      </div>
    </>
  );
}

function ShortcutBadge({ children }) {
  const isBrowser = typeof window !== "undefined";
  const isMac = isBrowser
    ? navigator.platform.toUpperCase().indexOf("MAC") >= 0
    : false;

  const cmdEmoji = "⌘";
  const ctrlEmoji = "⌃";

  const shortcut = isMac ? cmdEmoji : ctrlEmoji;

  return (
    <div className="rounded-full bg-white px-3 py-1 shadow-md w-[100px] flex justify-center">
      {shortcut}
      {children}
    </div>
  );
}
`;

export const defaultHtml = `
<html style="height: 100%">
  <head>
    <link rel="stylesheet" href="/styles.css" />
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="w-full h-full">
    <div class="h-full">
      <header class="h-full flex flex-col items-center justify-center bg-green-500">
        <div class="w-full p-4">
          <div class="flex">
            <div class="flex-1 flex items-end justify-center">
              <h1 class="text-white text-8xl font-black">
                ✌️ hey
                <br /> world.
              </h1>
            </div>
            <div class="flex-1 grid place-items-center bg-white bg-opacity-60 p-4 rounded-lg">
              <ul class="grid gap-2 text-lg font-bold">
                <li>✅ lightweight browser editor + preview</li>
                <li class="flex items-center space-x-2">
                  <div>✅ prettier formatting</div>
                </li>
                <li>✅ save, update, & delete snippets</li>
                <li>✅ react + html templates</li>
                <li>✅ ai chatbot</li>
                <li>
                  🚀
                  <a
                    href="https://hey-world.dev/feature-roadmap"
                    class="hover:opacity-50"
                  >
                    feature roadmap
                  </a>
                </li>
                <li>
                  🐛
                  <a
                    href="https://hey-world.dev/bug-report"
                    class="hover:opacity-50"
                  >
                    report a bug
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div class="text-center text-3xl font-bold  mb-16 mt-8">
          build <span class="bg-white bg-opacity-60 p-1 rounded">UI</span> with the help of <span class="bg-white bg-opacity-60 p-1 rounded">AI</span>
          </div>
          <div class="grid place-items-center opacity-60 absolute right-3 bottom-20">
          <ul class="grid gap-2">
            <li class="flex items-center justify-end gap-2">
              <div>chatbot</div>
              <div class="rounded-full bg-white px-3 py-1 shadow-md w-[100px] flex justify-center"><span class="shortcut"></span> + b</span></div>
            </li>
            <li class="flex items-center justify-end gap-2">
              <div>menu</div>
              <div class="rounded-full bg-white px-3 py-1 shadow-md w-[100px] flex justify-center"><span class="shortcut"></span> + m</span></div>
            </li>
            <li class="flex items-center justify-end gap-2">
              <div>save</div>
              <div class="rounded-full bg-white px-3 py-1 shadow-md w-[100px] flex justify-center"><span class="shortcut"></span> + s</span></div>
            </li>
            <li class="flex items-center justify-end gap-2">
              <div>save as</div>
              <div class="rounded-full bg-white px-3 py-1 shadow-md w-[100px] flex justify-center"><span class="shortcut"></span> + ^ + s</span></div>
            </li>
            <li class="flex items-center justify-end gap-2">
              <div>new</div>
              <div class="rounded-full bg-white px-3 py-1 shadow-md w-[100px] flex justify-center"><span class="shortcut"></span> + n</span></div>
            </li>
            <li class="flex items-center justify-end gap-2">
              <div>format</div>
              <div class="rounded-full bg-white px-3 py-1 shadow-md w-[100px] flex justify-center"><span class="shortcut"></span> + p</span></div>
            </li>
          </ul>
        </div>
        </div>
      </header>
      <div class="text-3xl font-bold fixed bottom-4 left-2 flex items-center space-x-2">
        <div class="text-4xl hand">👈</div>
        <h2 class="font-bold">tinker</h2>
      </div>
      <div class="text-3xl font-bold fixed bottom-4 right-[75px] flex items-center space-x-2">
        <h2 class="font-bold">chat</h2>
        <div class="text-4xl hand">👉</div>
      </div>
    </div>
    <script src="./app.js"></script>
  </body>
</html>
`;
export const defaultCss = `
.hand { 
  animation: horizontal 1s ease-in-out infinite; 
}

@keyframes horizontal { 
  0% { 
    transform: translateX(0); 
  } 
  50% { 
    transform: translateX(-5px); 
  } 
  100% { 
    transform: translateX(0); 
  } 
}
`;

export const defaultJs = `console.log("hey world from vanilla js.");
function getShortcuts() {
  const isBrowser = typeof window !== "undefined";
  const isMac = isBrowser
    ? navigator.platform.toUpperCase().indexOf("MAC") >= 0
    : false;

  const cmdEmoji = "⌘";
  const ctrlEmoji = "⌃";

  const userShortcut = isMac ? cmdEmoji : ctrlEmoji;
  const shortcutElement = document.getElementById("format-shortcut");
  const shortcuts = Array.from(document.querySelectorAll(".shortcut"))
  
  shortcuts.forEach(shortcut => shortcut.innerHTML = userShortcut)
}


getShortcuts();

`;

import { FaReact, FaHtml5 } from "react-icons/fa";

export const editorConfigObject = {
  React: {
    templateName: "react",
    icon: <FaReact />,
    files: {
      "/App.js": { code: defaultJsx, active: true },
      "/styles.css": { code: defaultCss, active: false },
    },
  },
  HTML: {
    templateName: "static",
    icon: <FaHtml5 />,
    files: {
      "/index.html": { code: defaultHtml, active: true },
      "/styles.css": { code: defaultCss, active: false },
      "/app.js": { code: defaultJs, active: false },
    },
  },
};
