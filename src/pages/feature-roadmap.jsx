import React, { useState } from "react";

export default function FeatureRoadmapPage() {
  return (
    <div className="flex h-screen w-full gap-2 p-2">
      <FeatureRoadmap />
    </div>
  );
}

const features = [
  {
    name: "Ability for chat ai to use context of code editor in responses",
    status: "Planned",
    progress: 0,
  },
  {
    name: "Preview console",
    status: "Planned",
    progress: 0,
  },
  {
    name: "Support for markdown editor",
    status: "Planned",
    progress: 0,
  },
  {
    name: "Customizable keyboard shortcuts",
    status: "Planned",
    progress: 0,
  },
  {
    name: "Improved editor menu UI",
    status: "Planned",
    progress: 0,
  },
  {
    name: "Better syntax highlighting",
    status: "Planned",
    progress: 0,
  },
  {
    name: "Live linting",
    status: "Planned",
    progress: 0,
  },
  {
    name: "Copy/paste from chat",
    status: "Planned",
    progress: 0,
  },
];

export const FeatureRoadmap = () => {
  const [message, setMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const onSubmit = async (formData) => {
    // Handle the form data submission here
    const response = await fetch("/api/feature-request", {
      headers: {
        "Content-Type": "application/json",
      },

      method: "POST",
      body: JSON.stringify({
        email: formData.email,
        featureDescription: formData.featureDescription,
      }),
    });
    const data = await response.json();
    // TODO: handle multiple submits in same session
    setMessage(data.message);
  };

  return (
    <div className="mx-auto w-full max-w-5xl p-8">
      <header className="mb-8">
        <h1 className="mb-4 text-4xl font-bold">Our Feature Roadmap</h1>
        <p className="text-lg text-gray-600">
          We're constantly working to improve our application and provide the
          best experience for our users. Below, you'll find a list of features
          we're planning to implement, along with their current status and
          progress. We'll update this page regularly, so be sure to check back
          for the latest information.
        </p>
      </header>
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Feature Roadmap</h2>
          <button
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            onClick={handleOpenModal}
          >
            Request Feature
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
        <FeatureRequestModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={onSubmit}
        />
        <ul>
          {features.map((feature, idx) => (
            <FeatureCard key={idx} feature={feature} />
          ))}
        </ul>
      </section>
    </div>
  );
};

export const FeatureRequestModal = ({ isOpen, onClose, onSubmit }) => {
  const [emailInputValue, setEmailInputValue] = useState("");
  const [featureDescriptionInputValue, setFeatureDescriptionInputValue] =
    useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Pass the form data to the onSubmit prop
    onSubmit({
      email: emailInputValue,
      featureDescription: featureDescriptionInputValue,
    });

    // Clear the form data
    setEmailInputValue("");
    setFeatureDescriptionInputValue("");

    // Close the modal
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="w-full max-w-md rounded bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-bold">Request a Feature</h2>
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
            <span className="text-gray-700">
              Feature description: (required)
            </span>
            <textarea
              required={true}
              value={featureDescriptionInputValue}
              onChange={(e) => setFeatureDescriptionInputValue(e.target.value)}
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

// TODO: implement progress (for feature or for likes???)
const FeatureCard = ({ feature, id }) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const likeButtonClass = `text-xl cursor-pointer transition-colors ${
    isLiked ? "text-red-500 animate-boop" : "text-gray-500"
  }`;

  const likeEmoji = isLiked ? "❤️" : "♡";

  return (
    <li className="mb-4 rounded-lg bg-white p-6 shadow-md">
      <div className="flex w-full justify-between">
        <h3 className="mb-2 text-xl font-semibold">{feature.name}</h3>
        {/* <div className={likeButtonClass} onClick={handleLike}>
          {likeEmoji}
        </div> */}
      </div>
      <p className="text-gray-600">{feature.status}</p>
      <div className="mt-4 h-2 w-full rounded bg-gray-200">
        <div
          className={`h-full ${
            feature.progress === 100 ? "bg-green-500" : "bg-blue-500"
          } rounded`}
          style={{ width: `${feature.progress}%` }}
        ></div>
      </div>
    </li>
  );
};
