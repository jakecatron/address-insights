export interface GeocodeResult {
    lat: number;
    lon: number;
    displayName: string;
  }
  
  export async function geocodeAddress(
    address: string
  ): Promise<GeocodeResult | null> {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  
    if (!token) {
      console.error("Missing NEXT_PUBLIC_MAPBOX_TOKEN");
      return null;
    }
  
    const url = new URL(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        address
      )}.json`
    );
    url.searchParams.set("access_token", token);
    url.searchParams.set("limit", "1");
  
    const res = await fetch(url.toString());
  
    if (!res.ok) {
      console.error("Mapbox geocode error", res.status);
      return null;
    }
  
    const data = await res.json();
    const feature = data.features?.[0];
  
    if (!feature) return null;
  
    const [lon, lat] = feature.center;
  
    return {
      lat,
      lon,
      displayName: feature.place_name,
    };
  }