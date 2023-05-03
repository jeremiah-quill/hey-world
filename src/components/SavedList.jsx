import { motion, AnimatePresence } from "framer-motion";

export function SavedList({
  className = "",
  savedCreations = [],
  onProjectClick,
  onRemoveClick,
  currentProjectId,
}) {
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
        {savedCreations.map((item, idx) => (
          <motion.li
            className={`flex min-h-[40px] items-center justify-between p-2 ${
              currentProjectId === item.id && "bg-slate-200 dark:bg-slate-600"
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
              onClick={() => onProjectClick(item.id)}
            >
              {item.name}
            </button>
            <button
              className="ml-4 text-red-500 hover:opacity-50"
              onClick={(e) => onRemoveClick(item.id, e)}
            >
              Delete
            </button>
          </motion.li>
        ))}
      </ul>
    </AnimatePresence>
  );
}
