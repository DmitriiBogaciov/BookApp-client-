import React, { useState, useRef, useEffect } from 'react';
import { Editor, EditorState, DraftHandleValue, getDefaultKeyBinding, Modifier, SelectionState } from 'draft-js';

interface AutocompletePluginProps {
  setEditorState: (state: EditorState) => void;
  getEditorState: () => EditorState
}

// Список предложений для автозаполнения
const suggestionList = ['title', 'author', 'year', 'genre', 'description'];

interface AutocompletePluginReturn {
  onChange: (state: EditorState) => void;
  renderSuggestions: () => JSX.Element;
  handleKeyCommand: (command: string) => DraftHandleValue
}

const AutocompleteForDraftJs = ({
  setEditorState,
  getEditorState,
}: AutocompletePluginProps) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [suggestionIndex, setSuggestionIndex] = useState<number>(0);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const suggestionsRef = useRef<HTMLUListElement | null>(null);

  const onChange = (state: EditorState) => {
    setEditorState(state);

    const selection = state.getSelection();
    const content = state.getCurrentContent();
    const block = content.getBlockForKey(selection.getStartKey());
    const text = block.getText();
    console.log("Text: ", text)
    const offset = selection.getStartOffset();

    const prefix = text.slice(0, offset);
    console.log("Prefix", prefix)
    const match = text.match(/"(\w*)$/);
    console.log("Match", match)

    if (match) {
      const word = match[1];
      console.log("Word", word)
      const filteredSuggestions = suggestionList.filter((suggestion) =>
        suggestion.startsWith(word) && !word.includes(suggestion)
      );
      if (filteredSuggestions.length > 0) {
        setSuggestions(filteredSuggestions);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }

    return state;
  };

  const insertSuggestion = (text: string) => {
    const editorState = getEditorState();
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();

    const newContentState = Modifier.replaceText(contentState, selection, text);
    const newEditorState = EditorState.push(editorState, newContentState, 'insert-characters');

    setEditorState(EditorState.forceSelection(newEditorState, newContentState.getSelectionAfter()));
    setSuggestions([]);
    setSuggestionIndex(0);
  };

  const handleKeyCommand = (command: string, editor: EditorState): DraftHandleValue => {
    if (suggestions && suggestions.length > 0) {
      if (command === 'confirm-suggestion') {
        insertSuggestion(suggestions[suggestionIndex]);
        return 'handled';
      }
      if (command === 'next-suggestion') {
        setSuggestionIndex((prev) => (prev + 1) % suggestions.length);
        return 'handled';
      }
      if (command === 'prev-suggestion') {
        setSuggestionIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
        return 'handled';
      }
    }
    return 'not-handled';
  };

  const keyBindingFn = (e: React.KeyboardEvent): string | null => {
    if (suggestions && suggestions.length > 0) {
      if (e.key === 'Tab' || e.key === 'Enter') return 'confirm-suggestion';
      if (e.key === 'ArrowDown') return 'next-suggestion';
      if (e.key === 'ArrowUp') return 'prev-suggestion';
    }
    return getDefaultKeyBinding(e);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const editorClicked = editorRef.current?.contains(e.target as Node);
      const suggestionsClicked = suggestionsRef.current?.contains(e.target as Node);

      if (!editorClicked && !suggestionsClicked) {
        setTimeout(() => {
          setSuggestions([]);
          setShowSuggestions(false);
        }, 1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return {
    onChange,
    handleKeyCommand,
    keyBindingFn,
    editorRef,
    renderSuggestions: () => (
      <ul ref={suggestionsRef}>
        {showSuggestions &&
          suggestions.map((suggestion, index) => (
            <li
              key={index}
              className={`p-1 ${index === suggestionIndex ? 'bg-slate-200' : 'hover:bg-slate-200'}`}
              onMouseEnter={() => setSuggestionIndex(index)}
              onClick={() => insertSuggestion(suggestion)}
            >
              {suggestion}
            </li>
          ))}
      </ul>
    ),
  };
};

export default AutocompleteForDraftJs;