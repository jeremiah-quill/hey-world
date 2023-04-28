export const defaultJsx = `import React, {useState} from 'react';

export default function App() {
  console.log("hey world.")
  
  return (
    <div className="App">
      <div className="header">
        <h1>hey world.</h1>
      </div>
      <Github />
      <main>
        <div className="left">
          <Hands />
        </div>
        <div className="right">
          <Features />
        </div>
      </main>
    </div>
  )
}

function Github() {
  return (
      <div className="github-section">
        <p className="github-copy">This project is 100% open source. Feel free to fork and contribute, or star the repo!</p>
        <div className="github-icon">
          <a target="_blank" href="https://github.com/jeremiah-quill/hey-world" target="_blank" rel="noopener noreferrer">
            <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" />
          </a>
        </div>
      </div>
  )
}

function Features() {
  return (
    <div className="features">
      <p>✅ In browser editor + preview</p>
      <p>✅ Multiple templates + environments</p>
      <p>✅ AI chatbot</p>
      <p>🛠️ More to come!</p>
    </div>
  )
}

function Hands() {
  return (
    <div className="hands">
      <h2><span className="hand-1">👈</span> tinker</h2>
      <h2><span className="hand-2">👇</span> consult ai</h2>
    </div>
  )
}
`;

export const defaultHtml = `
<html>
  <head>
    <link rel="stylesheet" href="/styles.css"/>
  </head>
  <body>
    <div class="App">
    <div class="header">
      <h1>hey world.</h1>
    </div>
    <div class="github-section">
      <p class="github-copy">This project is 100% open source. Feel free to fork and contribute, or star the repo!</p>
      <div class="github-icon">
        <a target="_blank" href="https://github.com/jeremiah-quill/hey-world" target="_blank" rel="noopener noreferrer">
          <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" />
        </a>
      </div>
    </div>
    <main>
      <div class="left">
        <div class="hands">
          <h2><span class="hand-1">👈</span> tinker</h2>
          <h2><span class="hand-2">👇</span> consult ai</h2>
        </div>
      </div>
      <div class="right">
        <div class="features">
          <p>✅ In browser editor + preview</p>
          <p>✅ Multiple templates + environments</p>
          <p>✅ AI chatbot</p>
          <p>🛠️ More to come!</p>
        </div>
      </div>
    </main>
    </div>
    <script src="/app.js"></script>
  </body>
</html>
`;
export const defaultCss = `* {
  box-sizing: border-box;
}

html, body {
  height: 100%;
  margin: 0px;
  padding: 0px;
}

/* layout */
body {
  display: flex;
  flex-direction: column;
  font-family: system-ui;
  align-items: center;
  justify-content: center;
}
#root {
  position: absolute;
  inset: 0;
}
.App {
  height : 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
main {
  display: flex;
  width: 100%;
  padding: 0rem 1rem;
}
.left, .right {
  flex: 1;
  border-radius: 4px;
  padding: 1rem
}
.left {
  display: grid;
  place-items: center;
}
.right {
  display: grid;
  place-items: center;
}

/* title */
.header h1 {
  background-color: #4CAF50; 
  color: white; 
  color: #fff; 
  margin: 0px;
  font-weight: 900;
  font-size: 100px;
  text-align: center;
  width: 100%;
  padding: 1rem;
}

/* github */
.github-icon {
  display: flex;
  justify-content: center;
  margin-top: .5rem;
}
.github-icon img {
  width: 40px;
}
.github-copy {
  margin: 0 auto;
  font-size: 1rem;
  color: gray;
  text-align: center;
}

/* hands */
.hands {
  font-size: 1.5rem;
}
.hands h2 {
  display: flex;
  gap: .5rem;
  margin: 0px;
}
.hand-1 { 
  animation: horizontal 1s ease-in-out infinite; 
  display: block;
}
.hand-2 { 
  animation: vertical 1s ease-in-out infinite; 
  display: block;
}

/* features */
.features {
  display: grid;
}
.features p {
  margin: 0px;
  text-align: left;
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
`;

export const defaultJs = `console.log("hey world.")
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
