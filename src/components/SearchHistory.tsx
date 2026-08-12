"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, Trash2 } from "lucide-react";
import { getSearchHistory, clearSearchHistory } from "@/lib/storage";
import { SearchHistoryItem } from "@/types";

export default function SearchHistory() {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);

  useEffect(() => {
    setHistory(getSearchHistory());
  }, []);

  const handleClear = () => {
    clearSearchHistory();
    setHistory([]);
  };

  if (history.length === 0) return null;

  return (
    <div className="mt-10 w-full max-w-xl">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
          <Clock size={16} />
          Recent searches
        </div>
        <button
          type="button"
          onClick={handleClear}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
        >
          <Trash2 size={14} />
          Clear
        </button>
      </div>

      <ul className="space-y-2">
        {history.map((item) => (
          <li key={item.address + item.searchedAt}>
            <Link
              href={`/insights?address=${encodeURIComponent(item.address)}`}
              className="block rounded-lg border border-gray-100 bg-white px-4 py-3 text-sm transition hover:border-[#FF4F00]/40 hover:bg-orange-50"
            >
              {item.address}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}