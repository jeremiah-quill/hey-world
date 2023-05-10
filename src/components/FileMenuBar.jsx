import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { RxCaretDown } from "react-icons/rx";

export function FileMenuBar({
  menuItems,
  projectTitleInputValue,
  setProjectTitleInputValue,
  saveProject,
  isTemplatePickerOpen,
  toggleTemplatePicker,
  currentTemplate,
  editorConfigObject,
  setCurrentTemplate,
  setIsTemplatePickerOpen,
  currentProject,
  // resetProject,
}) {
  const [activeMenu, setActiveMenu] = useState(null);

  const menuRef = useRef(null);

  const handleMenuClick = (index) => {
    setActiveMenu(activeMenu === index ? null : index);
  };
  const handleMenuOver = (index) => {
    setActiveMenu(index);
  };

  const handleOptionClick = (option) => {
    option.onClick();
    setActiveMenu(null); // Close the menu
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setActiveMenu(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //

  // close template picker when clicking outside of it
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsTemplatePickerOpen(false);
      }
    };
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    saveProject(currentProject.id);
  };

  // useEffect(() => {
  //   console.log("currentProject", currentProject);
  //   if (currentProject) {
  //     setProjectTitleInputValue(currentProject.name);
  //   } else {
  //     setProjectTitleInputValue("untitled");
  //   }
  // }, [currentProject]);

  return (
    <div className="flex items-stretch justify-between border-b bg-gray-100 text-slate-800 dark:border-slate-500 dark:bg-slate-800 dark:text-slate-300">
      {menuItems.map((menu, index) => (
        <div key={index} className="relative">
          <div
            onMouseLeave={() => setActiveMenu(null)} // Add onMouseLeave to close the menu
          >
            <button
              onMouseEnter={() => {
                if (activeMenu !== null) {
                  handleMenuOver(index);
                }
              }}
              className="px-4 py-4 hover:bg-slate-300 focus:outline-none dark:hover:bg-slate-600"
              onClick={() => handleMenuClick(index)}
            >
              {menu.title}
            </button>
            {activeMenu === index && (
              <motion.div
                ref={menuRef}
                initial={{ y: -5 }}
                animate={{ y: 0 }}
                onMouseLeave={() => setActiveMenu(null)} // Add onMouseLeave to close the menu
                className="menu-dropdown-container absolute left-0 z-[100] mt-[-2px] rounded border bg-white shadow dark:border-slate-500 dark:bg-slate-800 dark:text-slate-300"
              >
                {menu.options.map((option, i) => (
                  <button
                    key={i}
                    className="text-slate- flex w-full items-baseline justify-between px-4 py-2 text-left text-sm hover:bg-slate-300 focus:outline-none dark:hover:bg-slate-700"
                    onClick={() => handleOptionClick(option)}
                  >
                    <span>{option.name}</span>
                    <span className="ml-2 justify-between text-xs text-slate-600 dark:text-slate-500">
                      {option.shortcut}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      ))}
      <form className="h-full">
        <input
          required={true}
          className="h-full border-slate-300 p-2 outline-none dark:bg-slate-700"
          value={projectTitleInputValue}
          onChange={(e) => setProjectTitleInputValue(e.target.value)}
          placeholder="Name your snippet"
        />
        {/* <input
          className="ml-2 cursor-pointer hover:opacity-50"
          type="submit"
          value={currentProject ? "Save" : "Add"}
        /> */}
      </form>
      <div className="relative z-10 h-full" ref={dropdownRef}>
        <button
          onClick={toggleTemplatePicker}
          className="flex h-full items-center gap-2 px-4 text-slate-800 hover:bg-slate-300 focus:outline-none dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <div className="flex items-center gap-1">
            {editorConfigObject[currentTemplate].icon}
            {currentTemplate}
          </div>
          {
            <RxCaretDown
              className={`text-2xl transition-all ${
                isTemplatePickerOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          }
        </button>
        {isTemplatePickerOpen && (
          <motion.ul
            initial={{ y: -5 }}
            animate={{ y: 0 }}
            onMouseLeave={() => setIsTemplatePickerOpen(false)} // Add onMouseLeave to close the menu
            className="absolute z-[100] mt-[-2px] w-full cursor-pointer overflow-hidden rounded border bg-white shadow dark:border-slate-500 dark:bg-slate-800 dark:text-slate-300"
          >
            {Object.keys(editorConfigObject).map((key, idx) => (
              <li
                key={idx}
                className="flex w-full items-baseline justify-between px-4 py-2 text-left text-sm text-slate-800 hover:bg-slate-300 focus:outline-none  dark:border-slate-500 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                onClick={() => {
                  setCurrentTemplate(key);
                  setIsTemplatePickerOpen(false);
                }}
              >
                <div className="flex items-center gap-2">
                  {editorConfigObject[key].icon}
                  {key}
                </div>
              </li>
            ))}
          </motion.ul>
        )}
      </div>
    </div>
  );
}
