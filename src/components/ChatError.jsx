import Link from "next/link";

export const ChatError = ({ onBack, error }) => {
  return (
    <div className="absolute inset-0 grid place-items-center  dark:text-slate-300 ">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 dark:bg-gray-800 dark:text-gray-300">
        <h2 className="mb-4 text-2xl font-semibold text-slate-900 dark:text-slate-300">
          😢 It looks like something went wrong:
        </h2>
        <p className="mb-6">{error}</p>
        <div>
          If you're still stuck, please contact{" "}
          <a
            href="mailto:jcq5010@gmail.com"
            className="text-blue-500 hover:text-blue-700"
          >
            jcq5010@gmail.com
          </a>{" "}
          or{" "}
          <Link
            href="/bug-report"
            className="text-blue-500 hover:text-blue-700"
          >
            file a bug report.
          </Link>
        </div>
        <button
          onClick={onBack}
          className="mt-6 rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
        >
          Back
        </button>
      </div>
    </div>
  );
};
