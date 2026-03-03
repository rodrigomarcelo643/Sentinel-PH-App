import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Image } from 'react-native';
import { MapPin, Camera, X } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { reverseGeocode } from '../../services/geoapify';
import { googleReverseGeocode } from '../../services/googleMaps';
import * as Location from 'expo-location';

interface DetailsStepProps {
  description: string;
  location: string;
  coordinates: { latitude: number; longitude: number } | null;
  proofImage: string | null;
  onDescriptionChange: (text: string) => void;
  onLocationChange: (location: string, coordinates: { latitude: number; longitude: number } | null) => void;
  onImageSelect: (uri: string) => void;
  onOpenCamera: () => void;
}

export const DetailsStep = ({ description, location, coordinates, proofImage, onDescriptionChange, onLocationChange, onImageSelect, onOpenCamera }: DetailsStepProps) => {
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    setLoadingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission denied');
        setLoadingLocation(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;
      console.log('Got coordinates:', latitude, longitude);
      
      // Try Geoapify first, then Google Maps as fallback
      let result = await reverseGeocode(latitude, longitude);
      console.log('Geoapify result:', result);
      
      if (result) {
        const barangayName = result.suburb || result.district || 'Unknown Barangay';
        const cityName = result.city || 'Unknown City';
        const shortAddress = `${result.address_line1 || result.name || 'Location'}, Brgy. ${barangayName}, ${cityName}`;
        console.log('Setting location from Geoapify:', shortAddress);
        onLocationChange(shortAddress, { latitude, longitude });
      } else {
        // Fallback to Google Maps
        console.log('Geoapify failed, trying Google Maps');
        const googleResult = await googleReverseGeocode(latitude, longitude);
        
        if (googleResult) {
          const shortAddress = `${googleResult.barangay}, ${googleResult.address.split(',')[1] || 'Unknown City'}`;
          console.log('Setting location from Google Maps:', shortAddress);
          onLocationChange(shortAddress, { latitude, longitude });
        } else {
          // Final fallback
          console.log('Both APIs failed, using coordinates');
          onLocationChange(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`, { latitude, longitude });
        }
      }
    } catch (error) {
      console.error('Location error:', error);
      // Set fallback values even on error
      onLocationChange('Location unavailable', null);
    } finally {
      setLoadingLocation(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1B365D', marginBottom: 8, fontFamily: 'Inter-SemiBold' }}>
        Details
      </Text>
      <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 24, fontFamily: 'Inter-Medium' }}>
        Provide additional information
      </Text>

      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#1B365D', marginBottom: 8, fontFamily: 'Inter-SemiBold' }}>
          Description
        </Text>
        <TextInput
          value={description}
          onChangeText={onDescriptionChange}
          placeholder="Describe the situation in detail..."
          multiline
          numberOfLines={4}
          style={{
            borderWidth: 1,
            borderColor: '#E5E7EB',
            borderRadius: 12,
            padding: 12,
            fontSize: 14,
            color: '#1F2937',
            fontFamily: 'Inter-Medium',
            textAlignVertical: 'top',
            backgroundColor: 'white',
          }}
        />
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#1B365D', marginBottom: 8, fontFamily: 'Inter-SemiBold' }}>
          Location
        </Text>
        <TextInput
          value={location}
          onChangeText={(text) => onLocationChange(text, coordinates)}
          placeholder="Auto-filled from current location"
          multiline
          numberOfLines={3}
          style={{
            borderWidth: 1,
            borderColor: '#E5E7EB',
            borderRadius: 12,
            padding: 12,
            fontSize: 14,
            color: '#1F2937',
            fontFamily: 'Inter-Medium',
            backgroundColor: 'white',
            textAlignVertical: 'top',
          }}
        />
      </View>
      
      <View style={{ marginBottom: 20 }}>
        {loadingLocation ? (
          <View style={{ backgroundColor: '#F9FAFB', borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center' }}>
            <ActivityIndicator size="small" color="#1B365D" />
            <Text style={{ fontSize: 12, color: '#6B7280', marginLeft: 8, fontFamily: 'Inter-Medium' }}>Auto-filling location from GPS...</Text>
          </View>
        ) : null}
        {coordinates && (
          <Text style={{ fontSize: 10, color: '#6B7280', marginTop: 4, fontFamily: 'Inter-Medium' }}>
            Coordinates: {coordinates.latitude.toFixed(6)}, {coordinates.longitude.toFixed(6)}
          </Text>
        )}
      </View>

      <View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#1B365D', fontFamily: 'Inter-SemiBold' }}>
            Proof (Optional)
          </Text>
          {proofImage && (
            <TouchableOpacity
              onPress={() => onImageSelect(null!)}
              style={{ backgroundColor: '#EF4444', borderRadius: 9999, padding: 8 }}
            >
              <X size={16} color="white" strokeWidth={3} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          onPress={onOpenCamera}
          style={{
            borderWidth: 2,
            borderStyle: 'dashed',
            borderColor: '#9CA3AF',
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          {proofImage ? (
            <View>
              {imageLoading && (
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center', height: 192 }}>
                  <ActivityIndicator size="large" color="#1B365D" />
                </View>
              )}
              <Image 
                source={{ uri: proofImage }} 
                style={{ width: '100%', height: 192 }} 
                resizeMode="cover"
                onLoadStart={() => setImageLoading(true)}
                onLoadEnd={() => setImageLoading(false)}
              />
            </View>
          ) : (
            <View style={{ padding: 32, alignItems: 'center', backgroundColor: 'white' }}>
              <Camera size={48} color="#1B365D" strokeWidth={1.5} />
              <Text style={{ fontSize: 16, color: '#1B365D', marginTop: 16, fontFamily: 'Inter-SemiBold' }}>Take a picture</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
