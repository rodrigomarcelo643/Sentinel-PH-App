const GEOAPIFY_API_KEY = process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY;
const BASE_URL = 'https://api.geoapify.com/v1';

export interface GeoapifyPlace {
  place_id: string;
  display_name?: string;
  formatted: string;
  name?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  country?: string;
  postcode?: string;
  suburb?: string;
  district?: string;
  lat: number;
  lon: number;
}

export interface GeoapifyResponse {
  results?: GeoapifyPlace[];
  features?: Array<{
    properties: GeoapifyPlace;
    geometry: {
      coordinates: [number, number];
    };
  }>;
}

export const searchPlaces = async (query: string, countryCode = 'ph'): Promise<GeoapifyPlace[]> => {
  if (!query || query.length < 3) return [];
  
  try {
    const response = await fetch(
      `${BASE_URL}/geocode/autocomplete?text=${encodeURIComponent(query)}&countrycodes=${countryCode}&apiKey=${GEOAPIFY_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch places');
    }
    
    const data: GeoapifyResponse = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Geoapify search error:', error);
    return [];
  }
};

export const reverseGeocode = async (lat: number, lon: number): Promise<GeoapifyPlace | null> => {
  try {
    console.log('Reverse geocoding:', lat, lon);
    
    const url = `${BASE_URL}/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${GEOAPIFY_API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('Response not ok:', response.status, response.statusText);
      return null;
    }
    
    const data: GeoapifyResponse = await response.json();
    
    // Handle both response formats
    let place: GeoapifyPlace | null = null;
    
    if (data.features && data.features.length > 0) {
      // New format with features
      const feature = data.features[0];
      place = {
        ...feature.properties,
        lat: feature.geometry.coordinates[1],
        lon: feature.geometry.coordinates[0]
      };
    } else if (data.results && data.results.length > 0) {
      // Old format with results
      place = data.results[0];
    }
    
    console.log('Parsed place:', place);
    return place;
  } catch (error) {
    console.error('Geoapify reverse geocode error:', error);
    return null;
  }
};