export type AmenityCategory =
  | "restaurant"
  | "cafe"
  | "shop"
  | "park"
  | "school"
  | "transit"
  | "other";

export interface Amenity {
  id: string;
  name: string;
  category: AmenityCategory;
  lat: number;
  lon: number;
}

export interface AddressInsights {
  address: string;
  lat: number;
  lon: number;
  walkingScore: number;
  drivingScore: number;
  urbanSuburbanIndex: number;
  urbanSuburbanLabel: "Urban" | "Suburban" | "Rural";
  amenitiesWalking: Amenity[];
  amenitiesDriving: Amenity[];
  searchedAt: string;
}

export interface SearchHistoryItem {
  address: string;
  lat: number;
  lon: number;
  searchedAt: string;
}