import React, { useState } from "react";

// The BugReport component
const BugReport = ({ bug }) => (
  <div className="bg-white rounded p-4 shadow-md mb-4">
    <h3 className="text-xl font-bold">{bug.title}</h3>
    <p className="mt-2">{bug.description}</p>
  </div>
);

// The BugReportPage component
export default function BugReportPage() {
  const [message, setMessage] = useState(null);
  const [bugs, setBugReports] = useState([
    {
      title: "Prettier doesn't format CSS files",
      description: "We're on it.",
    },
    {
      title: "Pasting into editor can cause layout shift",
      description:
        "Sometimes if you paste a large amount of text into the bottom half of the editor container, the layout will shifta and the top project bar will disappear.",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (formData) => {
    // Handle the form data submission here
    const response = await fetch("/api/bug-report", {
      headers: {
        "Content-Type": "application/json",
      },

      method: "POST",
      body: JSON.stringify({ email: formData.email, bugDescription: formData.bugDescription }),
    });
    const data = await response.json();

    // TODO: handle multiple submits in same session
    setMessage(data.message);
  };

  return (
    <div className="w-full p-8 max-w-5xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Bug Report</h1>
        <p className="text-lg text-gray-600">
          Please use the form below to report any bugs you encounter while using our application. Your feedback helps us
          improve the experience for everyone.
        </p>
      </header>
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Known Bugs</h2>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={handleOpenModal}>
            Report Bug
          </button>
        </div>
        {message ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-8" role="alert">
            <p className="font-bold">{message}</p>
          </div>
        ) : null}
        <BugReportModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleSubmit} />
        <ul>
          {bugs.map((bug, idx) => (
            <BugReport key={idx} bug={bug} />
          ))}
        </ul>
      </section>
    </div>
  );
}

export const BugReportModal = ({ isOpen, onClose, onSubmit }) => {
  const [emailInputValue, setEmailInputValue] = useState("");
  const [newBugDescriptionInputValue, setNewBugDescriptionInputValue] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Pass the form data to the onSubmit prop
    onSubmit({ email: emailInputValue, bugDescription: newBugDescriptionInputValue });

    // Clear the form data
    setEmailInputValue("");
    setNewBugDescriptionInputValue("");

    // Close the modal
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Submit a bug</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-4">
            <span className="text-gray-700">Email (optional):</span>
            <input
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              type="text"
              value={emailInputValue}
              onChange={(e) => setEmailInputValue(e.target.value)}
            />
          </label>
          <label className="block mb-4">
            <span className="text-gray-700">Bug description: (required)</span>
            <textarea
              value={newBugDescriptionInputValue}
              onChange={(e) => setNewBugDescriptionInputValue(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              rows="5"></textarea>
          </label>
          <div className="flex justify-between items-center">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Submit
            </button>
            <button type="button" className="text-gray-600 hover:text-gray-800" onClick={onClose}>
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
