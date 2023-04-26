export function Preview({ previewContent = { html: "", css: "" } }) {
  const iframeTemplate = `
    <html>
      <head>
        <style>
          html, body {
            height: 100%;
            margin: 0px;
          }
          ${previewContent.css}
        </style>
      </head>
      <body>
        ${previewContent.html}
      </body>
    </html>
  `;

  return <iframe title="preview" srcDoc={iframeTemplate} className="w-full h-full" sandbox="allow-scripts"></iframe>;
}
