"use client";

import { useState, useEffect } from "react";
import { checkGrammar } from "./grammar";
 // your grammar API helper

interface Match {
  offset: number;
  length: number;
  replacements: { value: string }[];
}

interface GrammarEditorProps {
  text: string;
  setText: (value: string) => void;
}

export default function GrammarEditor({ text, setText }: GrammarEditorProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    async function fetchGrammar() {
      try {
        const correctedText = await checkGrammar(text);
        const parsedText = JSON.parse(correctedText);
        setMatches(parsedText.matches || []);
      } catch (error) {
        console.error("Failed to check grammar:", error);
      }
    }

    fetchGrammar();
  }, [text]);

  const handleSuggestionClick = (replacement: string) => {
    if (!selectedMatch) return;

    const { offset, length } = selectedMatch;
    const before = text.slice(0, offset);
    const after = text.slice(offset + length);
    const newText = before + replacement + after;

    setText(newText);
    setSelectedMatch(null);
  };

  const handleErrorClick = (e: React.MouseEvent, match: Match) => {
    e.stopPropagation();
    setSelectedMatch(match);
    setPopupPosition({ x: e.clientX, y: e.clientY });
  };

  const renderText = () => {
    const elements = [];
    let lastIndex = 0;

    matches.forEach((match, index) => {
      const { offset, length } = match;

      elements.push(
        <span key={`text-${index}`}>
          {text.slice(lastIndex, offset)}
        </span>
      );

      elements.push(
        <span
          key={`error-${index}`}
          className="underline decoration-red-500 decoration-2 cursor-pointer hover:bg-red-100 rounded px-1"
          onClick={(e) => handleErrorClick(e, match)}
        >
          {text.slice(offset, offset + length)}
        </span>
      );

      lastIndex = offset + length;
    });

    elements.push(
      <span key="end">
        {text.slice(lastIndex)}
      </span>
    );

    return elements;
  };

  return (
    <div className="relative p-4 border rounded-xl bg-white shadow-md w-full max-w-3xl mx-auto">
      <div className="text-lg leading-7 text-gray-800 whitespace-pre-wrap">
        {renderText()}
      </div>

      {selectedMatch && popupPosition && (
        <div
          className="absolute bg-white border border-gray-300 rounded-md shadow-lg p-2 space-y-2 z-50"
          style={{ top: popupPosition.y + 10, left: popupPosition.x }}
        >
          {selectedMatch.replacements.length > 0 ? (
            selectedMatch.replacements.map((r, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(r.value)}
                className="block w-full text-left text-gray-700 hover:bg-gray-100 px-2 py-1 rounded-md"
              >
                {r.value}
              </button>
            ))
          ) : (
            <div className="text-gray-400">No suggestions</div>
          )}
        </div>
      )}
    </div>
  );
}
