"use client";

import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Amenity } from "@/types";

interface MapProps {
  lat: number;
  lon: number;
  address: string;
  walkingAmenities?: Amenity[];
  drivingAmenities?: Amenity[];
}

export default function Map({
  lat,
  lon,
  address,
  walkingAmenities = [],
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;
    if (mapRef.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      console.error("Missing NEXT_PUBLIC_MAPBOX_TOKEN");
      return;
    }

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lon, lat],
      zoom: 14.5,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    new mapboxgl.Marker({ color: "#FF4F00" })
      .setLngLat([lon, lat])
      .setPopup(new mapboxgl.Popup().setHTML(`<strong>${address}</strong>`))
      .addTo(map);

    map.on("load", () => {
      walkingAmenities.slice(0, 10).forEach((a) => {
        new mapboxgl.Marker({ color: "#6b7280", scale: 0.7 })
          .setLngLat([a.lon, a.lat])
          .setPopup(
            new mapboxgl.Popup().setHTML(
              `<div><strong>${a.name}</strong><br/><span style="font-size:12px;color:#6b7280">${a.category}</span></div>`
            )
          )
          .addTo(map);
      });

      setLoaded(true);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [lat, lon, address, walkingAmenities]);

  return (
    <div className="relative h-80 w-full">
      <div ref={mapContainer} className="h-full w-full rounded-2xl" />
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
          Loading map…
        </div>
      )}
    </div>
  );
}