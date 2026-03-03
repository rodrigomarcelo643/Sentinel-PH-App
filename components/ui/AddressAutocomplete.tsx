import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { MapPin, Search, X } from 'lucide-react-native';
import { searchPlaces, GeoapifyPlace, reverseGeocode } from '../../services/geoapify';
import * as Location from 'expo-location';

interface AddressAutocompleteProps {
  label: string;
  placeholder: string;
  value: string;
  onLocationSelect: (location: {
    address: string;
    city?: string;
    state?: string;
    coordinates?: { latitude: number; longitude: number };
  }) => void;
  error?: string;
}

export const AddressAutocomplete = ({ label, placeholder, value, onLocationSelect, error }: AddressAutocompleteProps) => {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<GeoapifyPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [gettingCurrentLocation, setGettingCurrentLocation] = useState(false);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const handleSearch = async (text: string) => {
    setQuery(text);
    
    if (text.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoading(true);
    setShowSuggestions(true);
    
    try {
      const results = await searchPlaces(text);
      setSuggestions(results);
    } catch (error) {
      console.error('Search error:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlace = (place: GeoapifyPlace) => {
    setQuery(place.formatted || place.display_name);
    setShowSuggestions(false);
    setSuggestions([]);
    
    onLocationSelect({
      address: place.formatted || place.display_name,
      city: place.city,
      state: place.state,
      coordinates: { latitude: place.lat, longitude: place.lon }
    });
  };

  const getCurrentLocation = async () => {
    setGettingCurrentLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      // Use reverse geocoding to get address
      const result = await reverseGeocode(latitude, longitude);
      if (result) {
        handleSelectPlace(result);
      }
    } catch (error) {
      console.error('Location error:', error);
      alert('Failed to get current location');
    } finally {
      setGettingCurrentLocation(false);
    }
  };

  return (
    <View className="mb-3">
      <Text className="text-gray-700 text-sm mb-2 font-medium" style={{ fontFamily: 'Inter-Medium' }}>
        {label}
      </Text>
      
      <View className="relative">
        <View className={`flex-row items-center rounded-xl border-2 bg-white px-4 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}>
          <Search size={20} color="#6B7280" strokeWidth={2} />
          <TextInput
            className="flex-1 text-base text-gray-800 ml-3"
            style={{ paddingVertical: 16, fontFamily: 'Inter-Medium' }}
            placeholder={placeholder}
            value={query}
            onChangeText={handleSearch}
            onFocus={() => query.length >= 3 && setShowSuggestions(true)}
          />
          
          <TouchableOpacity
            onPress={getCurrentLocation}
            disabled={gettingCurrentLocation}
            className="ml-2 p-2"
          >
            {gettingCurrentLocation ? (
              <ActivityIndicator size="small" color="#1B365D" />
            ) : (
              <MapPin size={20} color="#1B365D" strokeWidth={2} />
            )}
          </TouchableOpacity>
          
          {query.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setQuery('');
                setSuggestions([]);
                setShowSuggestions(false);
                onLocationSelect({ address: '' });
              }}
              className="ml-2 p-1"
            >
              <X size={16} color="#6B7280" strokeWidth={2} />
            </TouchableOpacity>
          )}
        </View>

        {showSuggestions && (suggestions.length > 0 || loading) && (
          <View className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-xl mt-1 max-h-48 z-10">
            {loading ? (
              <View className="p-4 items-center">
                <ActivityIndicator size="small" color="#1B365D" />
                <Text className="text-gray-500 text-sm mt-2" style={{ fontFamily: 'Inter-Medium' }}>
                  Searching...
                </Text>
              </View>
            ) : (
              <FlatList
                data={suggestions}
                keyExtractor={(item) => item.place_id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleSelectPlace(item)}
                    className="p-3 border-b border-gray-100 flex-row items-center"
                  >
                    <MapPin size={16} color="#6B7280" strokeWidth={2} />
                    <View className="ml-3 flex-1">
                      <Text className="text-gray-800 text-sm" style={{ fontFamily: 'Inter-Medium' }}>
                        {item.formatted || item.display_name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                nestedScrollEnabled
              />
            )}
          </View>
        )}
      </View>
      
      {error && (
        <Text className="text-red-500 text-sm mt-1" style={{ fontFamily: 'Inter-Medium' }}>
          {error}
        </Text>
      )}
    </View>
  );
};