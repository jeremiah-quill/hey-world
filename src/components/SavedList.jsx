import { motion, AnimatePresence } from "framer-motion";
import { useModal } from "@/context/modalContext";

export function SavedList({
  className = "",
  savedSnippets = [],
  onSnippetClick,
  onRemoveClick,
  currentSnippetId,
}) {
  const { openModal, closeModal } = useModal();

  const listItemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.08, duration: 0.35, ease: "backOut" },
    }),
  };

  return (
    <AnimatePresence>
      <ul className={`${className}`}>
        {savedSnippets.map((item, idx) => (
          <motion.li
            className={`flex min-h-[40px] items-center justify-between p-2 ${
              currentSnippetId === item.id && "bg-slate-200 dark:bg-slate-600"
            }`}
            key={idx}
            custom={idx}
            variants={listItemVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <button
              className="truncate underline hover:opacity-50"
              onClick={() => onSnippetClick(item.id)}
            >
              {item.name}
            </button>
            <button
              className="ml-4 text-red-500 hover:opacity-50"
              onClick={() =>
                openModal({
                  content: (
                    <div>Are you sure you want to delete this snippet?</div>
                  ),
                  title: "Delete Snippet",
                  onSubmit: (e) => {
                    onRemoveClick(item.id, e);
                    closeModal();
                  },
                  // onSubmit: () => console.log("test"),
                })
              }
            >
              Delete
            </button>
          </motion.li>
        ))}
      </ul>
    </AnimatePresence>
  );
}
