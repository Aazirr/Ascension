"use client";

import { useEffect, useRef, useState } from "react";

interface SearchResult {
  id: string;
  label: string;
  section: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (nodeId: string) => void;
  searchableNodes: SearchResult[];
}

function fuzzyMatch(query: string, text: string): boolean {
  const queryLower = query.toLowerCase();
  let queryIndex = 0;
  let textIndex = 0;

  while (queryIndex < queryLower.length && textIndex < text.length) {
    if (queryLower[queryIndex] === text.toLowerCase()[textIndex]) {
      queryIndex++;
    }
    textIndex++;
  }

  return queryIndex === queryLower.length;
}

export default function SearchModal({
  isOpen,
  onClose,
  onSelect,
  searchableNodes,
}: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>(searchableNodes);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setSelectedIndex(0);
      return;
    }

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }, [isOpen]);

  useEffect(() => {
    if (query.trim() === "") {
      setResults(searchableNodes);
    } else {
      const filtered = searchableNodes.filter((node) =>
        fuzzyMatch(query, `${node.label} ${node.section}`),
      );
      setResults(filtered);
    }
    setSelectedIndex(0);
  }, [query, searchableNodes]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      onSelect(results[selectedIndex].id);
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm pt-32">
      <div className="w-full max-w-xl rounded-xl border border-white/20 bg-[rgba(5,5,16,0.96)] shadow-2xl">
        <div className="border-b border-white/10 p-4">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search projects, skills, experience..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-sm text-white placeholder-slate-400/50 outline-none"
          />
        </div>

        <div className="max-h-[360px] overflow-y-auto">
          {results.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400/70">
              No results found for &quot;{query}&quot;
            </div>
          ) : (
            results.map((result, index) => (
              <button
                key={result.id}
                onClick={() => {
                  onSelect(result.id);
                  onClose();
                }}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`w-full border-b border-white/5 px-4 py-3 text-left text-sm transition-colors ${
                  index === selectedIndex
                    ? "bg-white/10 text-white"
                    : "text-slate-200/85 hover:bg-white/5"
                }`}
              >
                <div className="font-medium">{result.label}</div>
                <div className="mt-0.5 text-xs uppercase tracking-[0.12em] text-slate-400/60">
                  {result.section}
                </div>
              </button>
            ))
          )}
        </div>

        <div className="border-t border-white/10 px-4 py-2 text-right text-xs text-slate-500/50">
          {query && `${results.length} result${results.length !== 1 ? "s" : ""}`}
          {!query && `${searchableNodes.length} items`}
        </div>
      </div>
    </div>
  );
}
