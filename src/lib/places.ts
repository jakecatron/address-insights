import { Amenity, AmenityCategory } from "@/types";

const WALKING_RADIUS_METERS = 800;
const DRIVING_RADIUS_METERS = 3000;

function categorize(types: string[] = []): AmenityCategory {
  if (types.some((t) => ["transit_station", "bus_station", "subway_station", "train_station", "light_rail_station"].includes(t))) {
    return "transit";
  }
  if (types.includes("park")) return "park";
  if (types.some((t) => ["school", "university", "primary_school", "secondary_school"].includes(t))) {
    return "school";
  }
  if (types.some((t) => ["restaurant", "meal_takeaway", "meal_delivery", "food"].includes(t))) {
    return "restaurant";
  }
  if (types.includes("cafe")) return "cafe";
  if (types.some((t) => ["store", "supermarket", "grocery_or_supermarket", "shopping_mall", "convenience_store"].includes(t))) {
    return "shop";
  }
  return "other";
}

interface GooglePlace {
  place_id: string;
  name: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  types?: string[];
}

interface GooglePlacesResponse {
  results: GooglePlace[];
  status: string;
  error_message?: string;
}

async function fetchAmenitiesInRadius(
  lat: number,
  lon: number,
  radiusMeters: number
): Promise<Amenity[]> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) {
    console.error("Missing GOOGLE_PLACES_API_KEY");
    return [];
  }

  const url = new URL(
    "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
  );
  url.searchParams.set("location", `${lat},${lon}`);
  url.searchParams.set("radius", String(radiusMeters));
  // No "type" param → one mixed results call instead of many
  url.searchParams.set("key", key);

  try {
    const res = await fetch(url.toString());
    if (!res.ok) {
      console.error("Google Places HTTP error", res.status);
      return [];
    }

    const data: GooglePlacesResponse = await res.json();

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      console.error("Google Places status:", data.status, data.error_message);
      return [];
    }

    return (data.results || []).map((place) => ({
      id: place.place_id,
      name: place.name,
      category: categorize(place.types),
      lat: place.geometry.location.lat,
      lon: place.geometry.location.lng,
    }));
  } catch (err) {
    console.error("Google Places fetch error", err);
    return [];
  }
}

export async function fetchNearbyAmenities(lat: number, lon: number) {
  const [walkingAmenities, drivingAmenities] = await Promise.all([
    fetchAmenitiesInRadius(lat, lon, WALKING_RADIUS_METERS),
    fetchAmenitiesInRadius(lat, lon, DRIVING_RADIUS_METERS),
  ]);

  return { walkingAmenities, drivingAmenities };
}