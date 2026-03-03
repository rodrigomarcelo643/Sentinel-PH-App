import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { MapPin, X } from 'lucide-react-native';
import * as Location from 'expo-location';

interface LocationPickerProps {
  onLocationSelect: (location: { address: string; latitude: number; longitude: number }) => void;
  initialLocation?: { latitude: number; longitude: number };
}

export const LocationPicker = ({ onLocationSelect, initialLocation }: LocationPickerProps) => {
  const [showMap, setShowMap] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(initialLocation || { latitude: 14.5995, longitude: 120.9842 });
  const [loading, setLoading] = useState(false);

  const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        #map { height: 100vh; width: 100vw; }
        html, body { height: 100%; margin: 0; padding: 0; }
        .controls {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 1000;
          background: white;
          padding: 10px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
      </style>
    </head>
    <body>
      <div class="controls">
        <button onclick="confirmLocation()" style="background: #1B365D; color: white; border: none; padding: 8px 16px; border-radius: 4px;">
          Confirm Location
        </button>
      </div>
      <div id="map"></div>
      <script>
        let map, marker, selectedLat = ${currentLocation.latitude}, selectedLng = ${currentLocation.longitude};
        
        function initMap() {
          map = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center: { lat: selectedLat, lng: selectedLng }
          });

          marker = new google.maps.Marker({
            position: { lat: selectedLat, lng: selectedLng },
            map: map,
            draggable: true,
            title: 'Selected Location'
          });

          marker.addListener('dragend', function() {
            selectedLat = marker.getPosition().lat();
            selectedLng = marker.getPosition().lng();
          });

          map.addListener('click', function(e) {
            selectedLat = e.latLng.lat();
            selectedLng = e.latLng.lng();
            marker.setPosition({ lat: selectedLat, lng: selectedLng });
          });
        }

        function confirmLocation() {
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: { lat: selectedLat, lng: selectedLng } }, (results, status) => {
            if (status === 'OK' && results[0]) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'locationSelected',
                latitude: selectedLat,
                longitude: selectedLng,
                address: results[0].formatted_address
              }));
            } else {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'locationSelected',
                latitude: selectedLat,
                longitude: selectedLng,
                address: \`\${selectedLat.toFixed(6)}, \${selectedLng.toFixed(6)}\`
              }));
            }
          });
        }
      </script>
      <script async defer src="https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap"></script>
    </body>
    </html>
  `;

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'locationSelected') {
        onLocationSelect({
          address: data.address,
          latitude: data.latitude,
          longitude: data.longitude
        });
        setShowMap(false);
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  const getCurrentLocation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        });
      }
    } catch (error) {
      console.error('Error getting location:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialLocation) {
      getCurrentLocation();
    }
  }, []);

  return (
    <>
      <TouchableOpacity
        onPress={() => setShowMap(true)}
        className="flex-row items-center justify-center bg-blue-50 border-2 border-blue-200 rounded-xl p-4"
      >
        <MapPin size={20} color="#1B365D" />
        <Text className="text-[#1B365D] font-medium ml-2" style={{ fontFamily: 'Inter-Medium' }}>
          Select Location on Map
        </Text>
      </TouchableOpacity>

      <Modal visible={showMap} animationType="slide" presentationStyle="fullScreen">
        <View style={{ flex: 1 }}>
          <View style={{ 
            backgroundColor: '#1B365D', 
            paddingTop: 50, 
            paddingBottom: 15, 
            paddingHorizontal: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', fontFamily: 'Inter-SemiBold' }}>
              Select Location
            </Text>
            <TouchableOpacity onPress={() => setShowMap(false)}>
              <X size={24} color="white" />
            </TouchableOpacity>
          </View>
          
          {loading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#1B365D" />
              <Text style={{ marginTop: 10, color: '#6B7280' }}>Loading map...</Text>
            </View>
          ) : (
            <WebView
              source={{ html: mapHtml }}
              style={{ flex: 1 }}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              onMessage={handleWebViewMessage}
            />
          )}
        </View>
      </Modal>
    </>
  );
};