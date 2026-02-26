import * as Location from 'expo-location';

export interface LocationData {
  region: string;
  municipality: string;
  barangay: string;
  fullAddress: string;
}

export const getCurrentLocation = async (): Promise<LocationData> => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') throw new Error('Location permission denied');

  const location = await Location.getCurrentPositionAsync({});
  const { latitude, longitude } = location.coords;

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`
  );

  const data = await response.json();
  if (data.status !== 'OK') throw new Error('Failed to get location');

  const addressComponents = data.results[0]?.address_components || [];
  
  let region = '';
  let municipality = '';
  let barangay = '';

  addressComponents.forEach((component: any) => {
    if (component.types.includes('administrative_area_level_1')) {
      region = component.long_name;
    }
    if (component.types.includes('locality') || component.types.includes('administrative_area_level_2')) {
      municipality = component.long_name;
    }
    if (component.types.includes('sublocality_level_1') || 
        component.types.includes('sublocality') || 
        component.types.includes('neighborhood') ||
        component.types.includes('administrative_area_level_3')) {
      barangay = component.long_name;
    }
  });

  return {
    region,
    municipality,
    barangay,
    fullAddress: data.results[0]?.formatted_address || '',
  };
};
