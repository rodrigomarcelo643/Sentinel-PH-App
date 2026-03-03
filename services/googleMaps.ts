const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

export interface GoogleMapsResult {
  formatted_address: string;
  address_components: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
}

export const googleReverseGeocode = async (lat: number, lon: number): Promise<{ address: string; barangay: string } | null> => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${GOOGLE_MAPS_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Google Maps API failed');
    }
    
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      const address = result.formatted_address;
      
      // Extract barangay from address components
      let barangay = 'Unknown Barangay';
      for (const component of result.address_components) {
        if (component.types.includes('sublocality_level_1') || 
            component.types.includes('administrative_area_level_3') ||
            component.long_name.toLowerCase().includes('barangay')) {
          barangay = component.long_name;
          break;
        }
      }
      
      return { address, barangay };
    }
    
    return null;
  } catch (error) {
    console.error('Google Maps reverse geocode error:', error);
    return null;
  }
};