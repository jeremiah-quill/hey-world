export const defaultJsx = `import React, {useState} from 'react';

export default function App() {
  console.log("hey world.")
  
  return (
    <div className="App">
      <div className="header">
        <h1>✌️ hey world.</h1>
      </div>
      <main>
        <div className="hands-container">
          <Hands />
        </div>  
        <div className="intro">
          <Features />
        </div>
      </main>
      <div className="github-container">
        <Github />
      </div>
    </div>
  )
}

function Github() {
  return (
    <div className="github-icon">
      <a target="_blank" href="https://github.com/jeremiah-quill/hey-world" target="_blank" rel="noopener noreferrer">
        <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" />
      </a>
    </div>
  )
}

function Features() {
  return (
    <div className="features">
      <p>✅ lightweight browser editor + preview</p>
      <p>✅ multiple templates + environments</p>
      <p>✅ ai chatbot</p>
      <p>🛠️ ...more to come</p>
    </div>
  )
}

function Hands() {
  return (
    <div className="hands"  style={{position: "absolute", bottom: "10px", left: "10px"}}>
      <div className="hand-line"><div className="hand-1">👈</div><h2>tinker</h2></div>
      <div className="hand-line"><div className="hand-2">👇</div> <h2>ask</h2></div>
    </div>
  )
}
`;

export const defaultHtml = `<html>
  <head>
    <link rel="stylesheet" href="/styles.css"/>
  </head>
  <body>
    <div class="App">
      <div class="header">
        <h1>✌️ hey world.</h1>
      </div>
      <main>
        <div class="hands-container">
          <div class="hands">
            <div class="hand-line"><div class="hand-1">👈</div><h2>tinker</h2></div>
            <div class="hand-line"><div class="hand-2">👇</div> <h2>ask</h2></div>
          </div>
        </div>  
      <div class="intro">
        <div class="features">
          <p>✅ lightweight browser editor + preview</p>
          <p>✅ multiple templates + environments</p>
          <p>✅ ai chatbot</p>
          <p>🛠️ ...more to come</p>
        </div>
      </div>
      </main>
      <div class="github-container">
        <div class="github-icon">
          <a target="_blank" href="https://github.com/jeremiah-quill/hey-world" target="_blank" rel="noopener noreferrer">
            <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" />
          </a>
        </div>
      </div>
    </div>
  </body>
</html>
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
.hands-container {
  position: absolute;
  width: 100%;
  bottom: 10px;
  left: 10px;
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
  font-size: 1.5rem;
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
  animation: vertical 1s ease-in-out infinite; 
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
