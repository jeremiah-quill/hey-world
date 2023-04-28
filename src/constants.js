export const defaultJsx = `import React, {useState} from 'react';

export default function App() {
  console.log("hey world.")

  const currentTodos = [
    {id: 1, text: 'add NextJS template'},
    {id: 2, text: 'replace CRA with Vite React template'},
    {id: 3, text: 'add darkmode'},
    {id: 4, text: 'add console to preview'},
    {id: 5, text: 'save snippets to local storage'},
    {id: 6, text: 'improve syntax highlighting'},
    {id: 7, text: 'prettier config in editor'},
    {id: 8, text: 'tailwind config'},
    {id: 9, text: 'vim mode extension'},
  ]

  return (
  <div className="container">
    <h1 className="cool-title">hey world.</h1>
    <div className="content-container">
      <div className="subtext">
        <div>
          <h2><span className="hand-1">👈</span> tinker</h2>
          <h2><span className="hand-2">👇</span> consult gpt</h2>
        </div>
      </div>
      <div className="todolist-container">
        <TodoList currentTodos={currentTodos}/>
      </div>
    </div>
  </div> 
  )
}

function TodoList({currentTodos}) {
  const [todos, setTodos] = useState(currentTodos);
  const [inputValue, setInputValue] = useState('');

  const addTodo = () => {
    if (!inputValue) return;
    const newTodo = { id: Date.now(), text: inputValue };
    setTodos(prevTodos => [...prevTodos, newTodo]);
    setInputValue('');
  };

  const removeTodo = (id) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  const handleKeyDown = (e) => {
    if (event.key === 'Enter') {
      addTodo()
    }
  }

  return (
    <div className="todo-list">
      <h2>To-do list (from React)</h2>
      <div className="todo-form">
        <input
          onKeyDown={handleKeyDown}
          type="text"
          value={inputValue}
          placeholder=""
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.text}
            <button onClick={() => removeTodo(todo.id)}>X</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
`;

export const defaultHtml = `<html>
<head>
  <link rel="stylesheet" href="/styles.css"/>
</head>
<body>
  <div class="container">
    <h1 class="cool-title">hey world.</h1>
    <div class="content-container">
      <div class="subtext">
        <div>
          <h2><span class="hand-1">👈</span> tinker</h2>
          <h2><span class="hand-2">👇</span> consult gpt</h2>
        </div>
    </div>
    <div class="todolist-container">
      <div class="todo-list">
        <h2>To-do list (from vanilla JS)</h2>
        <div class="todo-form">
          <input type="text"/>
          <button onClick={addTodo}>Add</button>
        </div>
        <ul>
        </ul>
        </div>
    </div>
    </div>
  </div> 
  <script src="/app.js"></script>
</body>
</html>
`;
export const defaultCss = `html, body {
  height: 100%;
  margin: 0px;
  padding: 0px;
}

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

.container {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  max-height: 100%;
}

.cool-title { 
  background-color: #4CAF50; 
  color: white; 
  padding: 12px 24px; 
  color: #fff; 
  margin: 0px;
  font-weight: 900;
  font-size: 100px;
  border-radius: .5rem;
  text-align: center;
 }

.content-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.subtext {
  font-size: 1.5rem;
  display: grid;
  place-items: center;
  flex: 1;
}

.subtext h2 {
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

/* TODO LIST */
.todolist-container {
  display: grid;
  place-items: center;
  flex: 1;
  overflow: auto;
}
.todo-form {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.todo-list h2 {
  font-size: 1rem;
  font-weight: bold;
  color: #333;
}

.todo-list input {
  display: block;
  padding: .5rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  font-family: 'Helvetica Neue', sans-serif;
  color: #333;
  flex: 1;
}

.todo-list button {
  background-color: #333;
  color: #fff;
  border-radius: 4px;
  border-top-left-radius: 0rem;
  border-bottom-left-radius: 0rem;
  padding: .5rem 2rem;
  font-family: 'Helvetica Neue', sans-serif;
  font-weight: bold;
  cursor: pointer;
}

.todo-list ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: .5rem;
}

.todo-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f2f2f2;
  border-radius: 4px;
  padding-left: .5rem;
  font-family: 'Helvetica Neue', sans-serif;
  font-size: 1rem;
  color: #333;
}

.todo-list li button {
  background-color: #ddd;
  color: #333;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: auto;
}
`;

export const defaultJs = `console.log("hey world.")

const currentTodos = [
  {id: 1, text: 'add NextJS template'},
  {id: 2, text: 'replace CRA with Vite React template'},
  {id: 3, text: 'add darkmode'},
  {id: 4, text: 'add console to preview'},
  {id: 5, text: 'save snippets to local storage'},
  {id: 6, text: 'improve syntax highlighting'},
  {id: 7, text: 'prettier config in editor'},
  {id: 8, text: 'tailwind config'},
  {id: 9, text: 'vim mode extension'},
]

const ul = document.querySelector('.todo-list ul');

currentTodos.forEach(todo => {
  const li = document.createElement('li');
  li.textContent = todo.text;
  
  const button = document.createElement('button');
  button.textContent = 'X';
  button.addEventListener('click', (e) => {
    e.target.parentNode.remove();
  });
  
  li.appendChild(button);
  ul.appendChild(li);
});

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
