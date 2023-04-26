// import React, { useState } from "react";

// export function Chat() {
//   const [inputValue, setInputValue] = useState("");
//   const [messages, setMessages] = useState([]);

//   const handleChange = (e) => {
//     setInputValue(e.target.value);
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       handleSendMessage();
//     }
//   };

//   const handleSendMessage = async () => {
//     // if input is empty, do nothing
//     if (inputValue.trim() === "") return;

//     // clear input
//     setInputValue("");

//     // save updated conversation
//     const newMessages = [...messages, { role: "user", content: inputValue }];

//     // update UI withupdated conversation
//     setMessages(newMessages);

//     // send updated conversation to gpt
//     const response = await fetch("/api/gpt", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ conversation: newMessages }),
//     });

//     const data = await response.json();

//     // update UI with conversation after gpt has responded
//     setMessages([...newMessages, { role: "assistant", content: data.choices[0].message.content }]);
//   };

//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex-1 flex flex-col max-h-full overflow-y-scroll">
//         <ul className="mt-auto grid gap-4 p-4">
//           {messages.map((msg, index) => (
//             <li
//               key={index}
//               className={`flex p-2 rounded gap-2 ${
//                 msg.role === "user" ? "bg-slate-200 ml-auto max-w-[75%]" : "mr-auto max-w-[75%] bg-slate-800 text-white"
//               }`}>
//               <div>{msg.content}</div>
//             </li>
//           ))}
//         </ul>
//       </div>
//       <div className="w-full flex">
//         <input
//           type="text"
//           className="flex-1 p-2"
//           placeholder="Type your message..."
//           value={inputValue}
//           onChange={handleChange}
//           onKeyDown={handleKeyDown}
//         />
//         <button className="p-2 bg-[#10a37f] text-white font-bold" onClick={handleSendMessage}>
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }

import React, { useState, useRef, useEffect } from "react";

export function Chat() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    setIsLoading(true);
    if (inputValue.trim() === "") return;

    setInputValue("");

    const newMessages = [...messages, { role: "user", content: inputValue }];
    setMessages(newMessages);

    const response = await fetch("/api/gpt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ conversation: newMessages }),
    });

    const data = await response.json();
    setMessages([...newMessages, { role: "assistant", content: data.choices[0].message.content }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 p-4">
      {/* <h1 className="text-2xl font-bold mb-4">Chatbot</h1> */}
      <div className="relative flex-1 flex flex-col bg-white shadow-md rounded-lg p-4 max-h-full overflow-y-scroll">
        <ul className="mt-auto grid gap-2">
          {messages.map((msg, index) => (
            <li
              key={index}
              className={`flex items-center p-2 rounded-lg gap-2 ${
                msg.role === "user" ? "bg-slate-200 ml-auto max-w-[75%]" : "bg-slate-800 text-white mr-auto max-w-[75%]"
              }`}>
              <div>{msg.content}</div>
            </li>
          ))}
          <div ref={messagesEndRef} />
        </ul>
      </div>
      <div className="w-full flex mt-4 justify-center">
        {isLoading ? (
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status">
            <span class="absolute -m-px h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        ) : (
          <>
            <input
              type="text"
              className="flex-1 p-2 rounded-l-lg border border-slate-300 outline-none"
              placeholder="Type your message..."
              value={inputValue}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
            <button className="p-2 bg-[#10a37f] text-white font-bold rounded-r-lg" onClick={handleSendMessage}>
              Send
            </button>
          </>
        )}
      </div>
    </div>
  );
}