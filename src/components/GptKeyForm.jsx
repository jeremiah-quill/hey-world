import { useState } from "react";

export function GptKeyForm({ setOpenaiKey }) {
  const [inputValue, setInputValue] = useState("");

  function handleChange(e) {
    setInputValue(e.target.value);
  }

  function handleSubmitKey() {
    localStorage.setItem("openai-key", inputValue);
    setOpenaiKey(inputValue);
    setInputValue("");
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmitKey();
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full h-full p-4">
      <div className="grid gap-6 mt-8 text-base max-w-xl mx-auto">
        <h2 className="font-bold text-center">Activate a personal AI chatbot for design and development assistance</h2>
        <p className="text-sm">
          This chatbot is designed to assist you with web design and web development tasks. To access the chatbot, you
          can choose one of the following options. More options will be made available in the future:
        </p>
        <ol className="list-decimal prose prose-sm list-inside">
          <li className="text-sm">
            <strong>Add a private OpenAI API key:</strong> You can enter your OpenAI API key directly into the input
            field below. By doing so, your API key will be securely stored in your browser's local storage. Note that
            your API key will only be used to communicate with the OpenAI API and won't be sent to our servers.
          </li>
          {/* <li className="text-sm">
            <strong>Sign up for a free account:</strong> Alternatively, you can clone this project's{" "}
            <a className="underline" target="_blank" rel="noopener" href="https://github.com/jeremiah-quill/hey-world">
              source code
            </a>{" "}
            and add your API key as an environment variable when deploying or running locally.
          </li> */}
        </ol>
        <p className="text-sm">
          If you don't have an OpenAI API key, you can obtain one by visiting{" "}
          <a className="underline" target="_blank" rel="noopener" href="https://platform.openai.com/account/api-keys">
            OpenAI API Keys.
          </a>
        </p>
      </div>

      <div className="mt-auto flex text-base">
        <input
          type="text"
          className="flex-1 p-2 rounded-l-lg border border-slate-300 outline-none"
          placeholder="Enter your OpenAI API key"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <button className="p-2 bg-[#10a37f] text-white font-bold rounded-r-lg" onClick={handleSubmitKey}>
          Submit
        </button>
      </div>
    </div>
  );
}
