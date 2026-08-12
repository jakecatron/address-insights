import { SearchHistoryItem } from "@/types";

const HISTORY_KEY = "address-insights-history";
const MAX_HISTORY = 8;

export function getSearchHistory(): SearchHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToSearchHistory(item: SearchHistoryItem) {
  if (typeof window === "undefined") return;

  const current = getSearchHistory().filter(
    (h) => h.address.toLowerCase() !== item.address.toLowerCase()
  );

  const updated = [item, ...current].slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

export function clearSearchHistory() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(HISTORY_KEY);
}