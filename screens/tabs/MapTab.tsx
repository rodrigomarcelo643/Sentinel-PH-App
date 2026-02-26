import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Linking, TouchableOpacity, Image, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import { MapPin, Navigation } from 'lucide-react-native';

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
const { width, height } = Dimensions.get('window');

export const MapTab = () => {
  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setLocation({ latitude: 14.5995, longitude: 120.9842 });
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
    } catch (error) {
      setLocation({ latitude: 14.5995, longitude: 120.9842 });
    } finally {
      setLoading(false);
    }
  };

  const openInGoogleMaps = () => {
    const lat = location?.latitude || 14.5995;
    const lng = location?.longitude || 120.9842;
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    Linking.openURL(url);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1B365D" />
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  const lat = location?.latitude || 14.5995;
  const lng = location?.longitude || 120.9842;
  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=${Math.floor(width)}x${Math.floor(height)}&markers=color:red%7C${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`;

  return (
    <View style={styles.container}>
      <Image source={{ uri: mapUrl }} style={styles.map} resizeMode="cover" />
      <View style={styles.locationCard}>
        <MapPin size={24} color="#1B365D" strokeWidth={2} />
        <Text style={styles.locationTitle}>Your Location</Text>
        <Text style={styles.locationCoords}>
          {lat.toFixed(6)}, {lng.toFixed(6)}
        </Text>
        <TouchableOpacity style={styles.openMapButton} onPress={openInGoogleMaps}>
          <Navigation size={18} color="white" strokeWidth={2} />
          <Text style={styles.openMapText}>Open Interactive Map</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  loadingText: {
    marginTop: 12,
    color: '#6B7280',
    fontFamily: 'Inter-Medium',
  },
  locationCard: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1B365D',
    marginTop: 8,
    fontFamily: 'Inter-SemiBold',
  },
  locationCoords: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
    fontFamily: 'Inter-Medium',
  },
  openMapButton: {
    backgroundColor: '#1B365D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
    gap: 8,
  },
  openMapText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
});
