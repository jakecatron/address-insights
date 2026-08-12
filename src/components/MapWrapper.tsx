"use client";

import dynamic from "next/dynamic";
import { Amenity } from "@/types";

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-80 items-center justify-center bg-gray-100 text-gray-400">
      Loading map…
    </div>
  ),
});

interface MapWrapperProps {
  lat: number;
  lon: number;
  address: string;
  walkingAmenities?: Amenity[];
  drivingAmenities?: Amenity[];
}

export default function MapWrapper(props: MapWrapperProps) {
  return <Map {...props} />;
}