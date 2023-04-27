export const defaultHtml = `<html>
<body>
<head>
  <link rel="stylesheet" href="/styles.css"/>
</head>
<div>
  <h1 class="cool-title">hey world.</h1>
  <div class="subtext">
    <h2><span class="hand-1">👈</span> tinker</h2>
    <h2><span class="hand-2">👇</span> chat</h2>
  </div>
</div>
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

.cool-title { 
  background-color: #4CAF50; 
  color: white; 
  padding: 12px 24px; 
  color: #fff; 
  margin: 0px;
  font-weight: 900;
  font-size: 100px;
  border-radius: .5rem;
 }

.subtext {
  margin-top: 2rem;
  font-size: 1.5rem;
  display: flex;
}

.subtext h2 {
  display: flex;
  gap: .5rem;
  padding: 1rem;
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
}`;
