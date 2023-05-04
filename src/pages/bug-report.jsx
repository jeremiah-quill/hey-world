import React, { useState } from "react";

// The BugReport component
const BugReport = ({ bug }) => (
  <div className="mb-4 rounded bg-white p-4 shadow-md">
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
      // description: "We're on it.",
    },
    {
      title: "Vim disabled until keymap issue fixed",
      description:
        "You will be able to toggle Vim mode in settings, but it is currently disabled globally (5/4/2023)",
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
      body: JSON.stringify({
        email: formData.email,
        bugDescription: formData.bugDescription,
      }),
    });
    const data = await response.json();

    // TODO: handle multiple submits in same session
    setMessage(data.message);
  };

  return (
    <div className="mx-auto w-full max-w-5xl p-8">
      <header className="mb-8">
        <h1 className="mb-4 text-4xl font-bold">Bug Report</h1>
        <p className="text-lg text-gray-600">
          Please use the form below to report any bugs you encounter while using
          our application. Your feedback helps us improve the experience for
          everyone.
        </p>
      </header>
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Known Bugs</h2>
          <button
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            onClick={handleOpenModal}
          >
            Report Bug
          </button>
        </div>
        {message ? (
          <div
            className="bg-green-100 border-green-400 text-green-700 mb-8 rounded border px-4 py-3"
            role="alert"
          >
            <p className="font-bold">{message}</p>
          </div>
        ) : null}
        <BugReportModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
        />
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
  const [newBugDescriptionInputValue, setNewBugDescriptionInputValue] =
    useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Pass the form data to the onSubmit prop
    onSubmit({
      email: emailInputValue,
      bugDescription: newBugDescriptionInputValue,
    });

    // Clear the form data
    setEmailInputValue("");
    setNewBugDescriptionInputValue("");

    // Close the modal
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="w-full max-w-md rounded bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-bold">Submit a bug</h2>
        <form onSubmit={handleSubmit}>
          <label className="mb-4 block">
            <span className="text-gray-700">Email (optional):</span>
            <input
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              type="text"
              value={emailInputValue}
              onChange={(e) => setEmailInputValue(e.target.value)}
            />
          </label>
          <label className="mb-4 block">
            <span className="text-gray-700">Bug description: (required)</span>
            <textarea
              value={newBugDescriptionInputValue}
              onChange={(e) => setNewBugDescriptionInputValue(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              rows="5"
            ></textarea>
          </label>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Submit
            </button>
            <button
              type="button"
              className="text-gray-600 hover:text-gray-800"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
