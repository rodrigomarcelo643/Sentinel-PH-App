import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Image } from 'react-native';
import { MapPin, Camera, X } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

interface DetailsStepProps {
  description: string;
  location: string;
  barangay: string;
  proofImage: string | null;
  onDescriptionChange: (text: string) => void;
  onLocationChange: (location: string, barangay: string) => void;
  onImageSelect: (uri: string) => void;
  onOpenCamera: () => void;
}

export const DetailsStep = ({ description, location, barangay, proofImage, onDescriptionChange, onLocationChange, onImageSelect, onOpenCamera }: DetailsStepProps) => {
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
        setLoadingLocation(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      if (data.results[0]) {
        const addressComponents = data.results[0].address_components;
        let brgy = '';
        
        addressComponents.forEach((component: any) => {
          if (component.types.includes('sublocality_level_1') || 
              component.types.includes('sublocality') || 
              component.types.includes('neighborhood')) {
            brgy = component.long_name;
          }
        });

        onLocationChange(data.results[0].formatted_address, brgy);
      }
    } catch (error) {
      // Silent fail
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
        {loadingLocation ? (
          <View style={{ backgroundColor: '#F9FAFB', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center' }}>
            <ActivityIndicator size="small" color="#1B365D" />
            <Text style={{ fontSize: 14, color: '#6B7280', marginLeft: 12, fontFamily: 'Inter-Medium' }}>Getting your location...</Text>
          </View>
        ) : location ? (
          <View style={{ backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#1B365D', borderRadius: 12, padding: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <MapPin size={16} color="#1B365D" strokeWidth={2} />
              <Text style={{ fontSize: 12, color: '#1B365D', marginLeft: 6, fontFamily: 'Inter-SemiBold' }}>Current Location</Text>
            </View>
            <Text style={{ fontSize: 12, color: '#6B7280', fontFamily: 'Inter-Medium' }}>{location}</Text>
            {barangay && (
              <Text style={{ fontSize: 13, color: '#1B365D', fontWeight: '600', marginTop: 4, fontFamily: 'Inter-SemiBold' }}>
                Barangay: {barangay}
              </Text>
            )}
          </View>
        ) : (
          <View style={{ backgroundColor: '#FEE2E2', borderRadius: 12, padding: 12 }}>
            <Text style={{ fontSize: 14, color: '#DC2626', fontFamily: 'Inter-Medium' }}>Failed to get location</Text>
          </View>
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
