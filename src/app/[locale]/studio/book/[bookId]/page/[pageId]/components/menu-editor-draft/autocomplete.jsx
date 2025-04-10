'use client';

import {
  EditorState,
  Modifier,
  getDefaultKeyBinding,
} from 'draft-js';
import { useState, useEffect, useRef } from 'react';

export default function CreateAutocompletePlugin(setEditorState, getEditorState) {
  const [suggestions, setSuggestions] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const editorRef = useRef(null);

  const insertSuggestion = (text) => {
    const editorState = getEditorState();
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();

    const newContentState = Modifier.replaceText(contentState, selection, text);
    const newEditorState = EditorState.push(editorState, newContentState, 'insert-characters');

    setEditorState(EditorState.forceSelection(newEditorState, newContentState.getSelectionAfter()));
    setSuggestions(null);
    setSelectedIndex(0);
  };

  const getSelectionCoords = () => {
    const selection = window.getSelection();
    console.log('📌 selection:', selection);
  
    if (!selection || selection.rangeCount === 0) return null;
  
    const range = selection.getRangeAt(0).cloneRange();
    console.log('📌 range before span insert:', range);
  
    const span = document.createElement('span');
    span.textContent = '\u200b'; // zero-width space
    span.style.position = 'absolute';
    span.style.opacity = '0';
    span.style.pointerEvents = 'none';
  
    range.insertNode(span);
    console.log('📌 inserted span:', span);
  
    const rect = span.getBoundingClientRect();
    console.log('📏 span rect:', rect);
  
    const coords = {
      top: rect.top + rect.height + window.scrollY,
      left: rect.left + window.scrollX,
    };
  
    console.log('✅ computed coords:', coords);
  
    span.remove();
  
    return coords;
  };

  const updateSuggestionPosition = () => {
    console.log('🔄 Updating suggestion position...');
    const coords = getSelectionCoords();
    if (coords) {
      setPosition(coords);
    } else {
      console.warn('❌ Could not determine cursor position');
    }
  };

  // useEffect(() => {
  //   if (suggestions) {
  //     setTimeout(updateSuggestionPosition, 0);
  //   }
  // },);

  return {
    ref: editorRef, 
    handleBeforeInput: (chars, editorState) => {
      console.log("🔁 handleBeforeInput called with:", chars);
      if (chars === '{') {
        console.log("🪄 Triggering suggestions");
        setSuggestions(['{', '{"key": "" }']);
        setSelectedIndex(0);
        updateSuggestionPosition();
        return 'handled';
      }
      return 'not-handled';
    },
    handleKeyCommand: (command, editorState) => {
      if (suggestions && suggestions.length > 0) {
        if (command === 'insert-autocomplete' || command === 'tab') {
          insertSuggestion(suggestions[selectedIndex]);
          return 'handled';
        }
        if (command === 'next-suggestion') {
          setSelectedIndex((prev) => (prev + 1) % suggestions.length);
          return 'handled';
        }
        if (command === 'prev-suggestion') {
          setSelectedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
          return 'handled';
        }
      }
      return 'not-handled';
    },
    keyBindingFn: (e) => {
      if (suggestions && suggestions.length > 0) {
        if (e.key === 'ArrowDown') return 'next-suggestion';
        if (e.key === 'ArrowUp') return 'prev-suggestion';
        if (e.key === 'Enter' || e.key === 'Tab') return 'insert-autocomplete';
      }
      return getDefaultKeyBinding(e);
    },
    onChange: (editorState) => {
      setEditorState(editorState);
      // if (suggestions) {
      //   updateSuggestionPosition();
      // }
      return editorState;
    },
    renderSuggestions: () =>
      suggestions && (
        <ul
          className="absolute bg-white border p-2 z-50 w-fit"
          style={{ top: position.top, left: position.left }}
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion}
              className={`p-1 ${index === selectedIndex ? 'bg-slate-200' : 'hover:bg-slate-100'}`}
              onMouseEnter={() => setSelectedIndex(index)}
              onClick={() => insertSuggestion(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      ),
  };
}
