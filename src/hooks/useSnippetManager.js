import { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";

export function useSnippetManager({
  sandpack,
  currentTemplate,
  setCurrentTemplate,
}) {
  const [snippetTitleInputValue, setSnippetTitleInputValue] =
    useState("untitled");
  const [currentSnippetId, setCurrentSnippetId] = useState(null);
  const [savedSnippets, setSavedSnippets] = useState([]);

  // Load snippets from localStorage
  useEffect(() => {
    if (typeof window === "undefined" || !window.localStorage) {
      return [];
    }
    const snippets = JSON.parse(localStorage.getItem("snippets"));

    if (!snippets) return;

    setSavedSnippets(snippets);
  }, []);

  // Helper function to sync snippets with localStorage
  const syncSnippetsWithLocalStorage = (snippets) => {
    localStorage.setItem("snippets", JSON.stringify(snippets));
  };

  const saveAs = () => {
    // create new snippet
    const id = uuid();
    const snippet = {
      templateName: currentTemplate,
      id: id,
      code: sandpack.files,
      name: snippetTitleInputValue,
    };

    // update state
    setSavedSnippets((prevSnippets) => {
      return [...prevSnippets, snippet];
    });

    setCurrentSnippetId(id);

    // sync with local storage
    const currentSnippets = JSON.parse(localStorage.getItem("snippets")) || [];
    currentSnippets.push(snippet);
    localStorage.setItem("snippets", JSON.stringify(currentSnippets));
  };

  const newSnippet = () => {
    setSnippetTitleInputValue("untitled");
    // save existing snippet
    if (currentSnippetId) {
      saveSnippet();
    }

    // create new snippet
    const id = uuid();
    const snippet = {
      templateName: currentTemplate,
      id: id,
      code: sandpack.files,
      name: snippetTitleInputValue, // TODO: add name input
    };

    // update state
    setSavedSnippets((prevSnippets) => {
      return [...prevSnippets, snippet];
    });

    setCurrentSnippetId(id);

    // sync with local storage
    const currentSnippets = JSON.parse(localStorage.getItem("snippets")) || [];
    currentSnippets.push(snippet);
    localStorage.setItem("snippets", JSON.stringify(currentSnippets));
  };

  const saveSnippet = () => {
    if (!currentSnippetId) {
      const id = uuid();
      const snippet = {
        templateName: currentTemplate,
        id: id,
        code: sandpack.files,
        name: snippetTitleInputValue, // TODO: add name input
      };

      // update state
      setSavedSnippets((prevSnippets) => {
        return [...prevSnippets, snippet];
      });

      setCurrentSnippetId(id);

      // sync with local storage
      const currentSnippets =
        JSON.parse(localStorage.getItem("snippets")) || [];
      currentSnippets.push(snippet);
      localStorage.setItem("snippets", JSON.stringify(currentSnippets));
    } else {
      const updatedSnippets = savedSnippets.map((savedSnippet) => {
        if (savedSnippet.id === currentSnippetId) {
          const updatedSnippet = {
            ...savedSnippet,
            code: sandpack.files,
            name: snippetTitleInputValue,
          };
          return updatedSnippet;
        } else {
          return savedSnippet;
        }
      });
      setSavedSnippets(updatedSnippets);
      localStorage.setItem("snippets", JSON.stringify(updatedSnippets));
    }
  };

  const removeSnippet = (id) => {
    // update state
    setSavedSnippets((prevSnippets) =>
      prevSnippets.filter((snippet) => snippet.id !== id)
    );

    // sync with local storage
    const updatedSnippets = savedSnippets.filter(
      (snippet) => snippet.id !== id
    );
    localStorage.setItem("snippets", JSON.stringify(updatedSnippets));
  };

  const loadSnippet = (snippetId) => {
    // get snippet from state
    const snippet = savedSnippets.find(
      (savedSnippet) => savedSnippet.id === snippetId
    );

    // update sandpack
    if (!snippet) return;
    setCurrentTemplate(snippet.templateName);
    setCurrentSnippetId(snippet.id);
    setSnippetTitleInputValue(snippet.name);
    sandpack.updateFile(snippet.code);
  };

  // initial snippet load
  useEffect(() => {
    if (typeof window === "undefined" || !window.localStorage) {
      return [];
    }
    const snippets = JSON.parse(localStorage.getItem("snippets"));

    if (!snippets) return;

    setSavedSnippets(snippets);
  }, []);

  return {
    snippetTitleInputValue,
    setSnippetTitleInputValue,
    currentSnippetId,
    savedSnippets,
    saveAs,
    newSnippet,
    saveSnippet,
    removeSnippet,
    loadSnippet,
  };
}
