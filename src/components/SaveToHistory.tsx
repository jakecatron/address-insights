"use client";

import { useEffect } from "react";
import { addToSearchHistory } from "@/lib/storage";

interface SaveToHistoryProps {
  address: string;
  lat: number;
  lon: number;
}

export default function SaveToHistory({ address, lat, lon }: SaveToHistoryProps) {
  useEffect(() => {
    addToSearchHistory({
      address,
      lat,
      lon,
      searchedAt: new Date().toISOString(),
    });
  }, [address, lat, lon]);

  return null;
}