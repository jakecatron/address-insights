"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Loader2 } from "lucide-react";

interface Suggestion {
  id: string;
  place_name: string;
}

export default function AddressSearch() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced Mapbox autocomplete
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 3) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      if (!token) return;

      setLoading(true);
      try {
        const url = new URL(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            query.trim()
          )}.json`
        );
        url.searchParams.set("access_token", token);
        url.searchParams.set("autocomplete", "true");
        url.searchParams.set("limit", "5");
        url.searchParams.set("types", "address,place");

        const res = await fetch(url.toString());
        if (!res.ok) return;

        const data = await res.json();
        const items: Suggestion[] = (data.features || []).map(
          (f: { id: string; place_name: string }) => ({
            id: f.id,
            place_name: f.place_name,
          })
        );

        setSuggestions(items);
        setOpen(items.length > 0);
      } catch (err) {
        console.error("Autocomplete error", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const goToInsights = (address: string) => {
    if (!address.trim()) return;
    setSubmitting(true);
    setOpen(false);
    router.push(`/insights?address=${encodeURIComponent(address.trim())}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    goToInsights(query);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) setOpen(true);
            }}
            placeholder="Enter a street address..."
            className="w-full rounded-xl border border-gray-200 bg-white px-5 py-4 pr-14 text-lg text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-[#FF4F00] focus:ring-2 focus:ring-[#FF4F00]/20"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={submitting || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-[#FF4F00] p-2.5 text-white transition hover:bg-[#e64600] disabled:opacity-50"
          >
            {submitting || loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Search size={20} />
            )}
          </button>
        </div>
      </form>

      {open && suggestions.length > 0 && (
        <ul className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
          {suggestions.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => {
                  setQuery(s.place_name);
                  goToInsights(s.place_name);
                }}
                className="flex w-full items-start gap-3 px-4 py-3 text-left text-sm transition hover:bg-orange-50"
              >
                <MapPin
                  size={16}
                  className="mt-0.5 shrink-0 text-[#FF4F00]"
                />
                <span className="text-gray-800">{s.place_name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}