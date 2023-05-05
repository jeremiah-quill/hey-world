export const defaultJsx = `import React, { useState } from "react";

export default function App() {
  console.log("hey world from react");

  return (
    <div className="App">
      <header className="header">
        <div className="hero">
          <div className="hero-content">
            <div className="hero-flex">
              <div className="title-container grid-center">
                <h1>
                  ✌️ hey<br></br> world.
                </h1>
              </div>
              <div className="feature-container grid-center">
                <Features />
              </div>
            </div>
            <div className="tagline">prototype UI with the help of AI</div>
          </div>
        </div>
      </header>
          <Hands />
    </div>
  );
}

function Features() {
  return (
    <ul className="features">
      <li>✅ lightweight browser editor + preview</li>
      <li className="prettier-li">
        <div>✅ prettier formatting</div>
        <ShortcutBadge />
      </li>
      <li>✅ save, update, & delete snippets</li>
      <li>✅ react + html templates</li>
      <li>✅ ai chatbot</li>
      <li>
        🚀 <a href="https://hey-world.dev/feature-roadmap">feature roadmap</a>
      </li>
      <li>
        🐛 <a href="https://hey-world.dev/bug-report">report a bug</a>
      </li>
    </ul>
  );
}

const ShortcutBadge = () => {
  const isBrowser = typeof window !== "undefined";
  const isMac = isBrowser
    ? navigator.platform.toUpperCase().indexOf("MAC") >= 0
    : false;

  const cmdEmoji = "⌘";
  const ctrlEmoji = "⌃";
  const sEmoji = "🇸";

  const shortcut = isMac ? cmdEmoji : ctrlEmoji;

  return (
    <>
      (<span className="shortcut-style">{shortcut}</span>
      <span>+</span>
      <span className="shortcut-style">s</span>)
    </>
  );
};

function Hands() {
  return (
    <>
      <div className="hand-line hand-line-1">
        <div className="hand-1">👈</div>
        <h2>tinker</h2>
      </div>
      <div className="hand-line hand-line-2">
      <h2>chat</h2> <div className="hand-2">👉</div> 
      </div>
    </>
  );
}
`;

export const defaultHtml = `
  <head>
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <div class="App">
      <header class="header">
        <div class="hero">
          <div class="hero-content">
            <div class="hero-flex">
              <div class="title-container grid-center">
                <h1>
                  ✌️ hey
                  <br /> world.
                </h1>
              </div>
              <div class="feature-container grid-center">
                <ul class="features">
                  <li>✅ lightweight browser editor + preview</li>
                  <li class="prettier-li">
                    ✅ prettier formatting <span id="format-shortcut"></span>
                  </li>
                  <li>✅ save, update, & delete snippets</li>
                  <li>✅ react + html templates</li>
                  <li>✅ ai chatbot</li>
                  <li>
                    🚀
                    <a href="https://hey-world.dev/feature-roadmap">
                      feature roadmap
                    </a>
                  </li>
                  <li>
                    🐛
                    <a href="https://hey-world.dev/bug-report">report a bug</a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="tagline">prototype UI with the help of AI</div>
          </div>
        </div>
      </header>
        <div class="hand-line hand-line-1">
          <div class="hand-1">👈</div>
          <h2>tinker</h2>
        </div>
        <div class="hand-line hand-line-2">
        <h2>chat</h2> <div class="hand-2">👉</div> 
        </div>
    </div>
    <script src="./app.js"></script>
  </body>
`;
export const defaultCss = `/* globals */
* {
  box-sizing: border-box;
}
#root {
  position: absolute;
  inset: 0;
}
html, body {
  height: 100%;
  margin: 0px;
  padding: 0px;
}
li, ul {
  margin: 0px;
  padding: 0px;
  list-style: none;
  font-weight: inherit;
}

/* layout */
body {
  display: flex;
  flex-direction: column;
  font-family: system-ui;
  align-items: center;
  justify-content: center;
}
.App {
  height : 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
}
main {
  display: flex;
  width: 100%;
  padding: 0rem 1rem;
  flex: 1;
}
.hand-line-1 {
  position: fixed;
  bottom: 0px;
  left: 10px;
  z-index: 100;
}

.hand-line-2 {
  position: fixed;
  bottom: 0px;
  right: 70px;
  z-index: 100;
}

/* title */
.header h1 {
  color: white; 
  color: #fff; 
  margin: 0px;
  font-weight: 900;
  font-size: 100px;
  text-align: center;
  padding: 1rem;
  height: 100%;
  text-align: end;
}
.hero {
  height: 100vh;
  place-items: center;
  display: grid;
  background-color: #4CAF50; 
  gap: 1rem;
}
.hero-content {
  width: 100%;
  display: grid;
  gap: 2rem;
}
.hero-flex {
  display: flex;
}
.grid-center {
  display: grid;
  place-items: center;
}
.tagline {
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
}

.title-container {
  flex: 1;
}
.feature-container {
  flex: 1;
  flex: 1;
  background: #ffffff99;
  padding: 1rem;
  margin-right: 1rem;
  border-radius: 8px;
}

.arrow-container {
  text-align: center;
  position: absolute;
  bottom: 25px;
}
.arrow-container span {
  font-size: 25px;
}

/* intro */
.intro {
  display: grid;
  place-items: center;
  flex: 1;
  border-radius: 4px;
  padding: 1rem
}

/* github */
.github-icon img {
  width: 40px;
}
.github-container {
  position: absolute;
  bottom: 10px;
  right: 10px;
}

/* features */
.features {
  display: grid;
  gap: .5rem;
  font-size: 1rem;
}
.features p {
  font-weight: bold;
  margin: 0px;
  text-align: left;
}

/* hands */
.hand-line {
  display: flex; 
  gap: .5rem;
  align-items: center;
}
.hands h2 {
  display: flex;
  gap: .5rem;
  margin: 0px;
  font-weight: bold;
}
.hand-1 { 
  animation: horizontal 1s ease-in-out infinite; 
  font-size: 2rem;
}
.hand-2 { 
  animation: horizontal 1s ease-in-out infinite; 
  font-size: 2rem;
}

/* animations */
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
@keyframes vertical { 
  0% { 
    transform: translateY(0); 
  } 
  50% { 
    transform: translateY(5px); 
  } 
  100% { 
    transform: translateY(0); 
  } 
}

.features li {
  font-weight: bold;
}

.features a {
  color: inherit;
}
.features a:hover {
  opacity: 50%;
}

.prettier-li {
  display: flex;
  align-items: center;
  gap: .5rem;
  font-weight: bold;
}

.shortcut-container {
  display: flex;
  align-items: center;
  font-weight: bold;
  gap: .5rem;
}

.shortcut-style {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 21px;
  width: 21px;
  border-radius: 4px;
  background-color: #eee;
  font-size: 1rem;
}

#format-shortcut {
  display: flex;
  align-items: center;
  gap: .5rem;
  font-weight: bold;
}
`;

export const defaultJs = `console.log("hey world from vanilla js.");

function setFormatShortcut() {
  const isBrowser = typeof window !== "undefined";
  const isMac = isBrowser
    ? navigator.platform.toUpperCase().indexOf("MAC") >= 0
    : false;

  const cmdEmoji = "⌘";
  const ctrlEmoji = "⌃";

  const shortcut = isMac ? cmdEmoji : ctrlEmoji;
  const shortcutElement = document.getElementById("format-shortcut");

  shortcutElement.innerHTML =
    '(<span class="shortcut-style">' +
    shortcut +
    "</span>" +
    "<span>+</span>" +
    '<span class="shortcut-style">s</span>)';
}

setFormatShortcut();
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
