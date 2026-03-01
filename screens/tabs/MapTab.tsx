import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, Dimensions, ScrollView, Modal, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { WebView } from 'react-native-webview';
import { MapPin, X, User, Calendar, Filter, ChevronDown } from 'lucide-react-native';
import { subscribeToSymptomReports, SymptomReport } from '../../services/symptomReports';
import { useAuth } from '../../context/AuthContext';

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
const { width, height } = Dimensions.get('window');

export const MapTab = () => {
  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [symptomReports, setSymptomReports] = useState<SymptomReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<SymptomReport | null>(null);
  const [severityFilter, setSeverityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [ownershipFilter, setOwnershipFilter] = useState<'all' | 'yours' | 'others'>('all');
  const [showSeverityDropdown, setShowSeverityDropdown] = useState(false);
  const [showOwnershipDropdown, setShowOwnershipDropdown] = useState(false);
  const webViewRef = useRef<WebView>(null);
  const { user } = useAuth();

  useEffect(() => {
    getCurrentLocation();
    
    const unsubscribe = subscribeToSymptomReports((reports) => {
      setSymptomReports(reports);
    });
    
    return unsubscribe;
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

  const filteredReports = useMemo(() => {
    return symptomReports.filter(report => {
      // Status filter: only show verified reports OR pending reports if they're yours
      if (report.status === 'pending' && report.userId !== user?.uid) {
        return false;
      }
      
      // Severity filter
      if (severityFilter !== 'all') {
        const severity = report.symptoms.length <= 2 ? 'low' : report.symptoms.length <= 4 ? 'medium' : 'high';
        if (severity !== severityFilter) return false;
      }
      
      // Ownership filter
      if (ownershipFilter === 'yours' && report.userId !== user?.uid) return false;
      if (ownershipFilter === 'others' && report.userId === user?.uid) return false;
      
      return true;
    });
  }, [symptomReports, severityFilter, ownershipFilter, user?.uid]);

  const lat = location?.latitude || 10.3031904;
  const lng = location?.longitude || 123.8919048;

  const mapHtml = useMemo(() => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        #map { height: 100vh; width: 100vw; }
        html, body { height: 100%; margin: 0; padding: 0; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        function initMap() {
          const map = new google.maps.Map(document.getElementById('map'), {
            zoom: 13,
            center: { lat: ${lat}, lng: ${lng} },
            mapTypeId: 'satellite'
          });

          // User location marker
          new google.maps.Marker({
            position: { lat: ${lat}, lng: ${lng} },
            map: map,
            title: 'Your Location',
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 12,
              fillColor: '#4285F6',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 3
            }
          });

          // Barangay boundary circle
          new google.maps.Circle({
            strokeColor: '#10B981',
            strokeOpacity: 1,
            strokeWeight: 4,
            fillColor: '#10B981',
            fillOpacity: 0.15,
            map: map,
            center: { lat: ${lat}, lng: ${lng} },
            radius: 800
          });

          ${filteredReports
            .filter(report => report.latitude && report.longitude)
            .map((report, index) => {
              const symptomCount = report.symptoms.length;
              const severityColor = symptomCount <= 2 ? '#10B981' : symptomCount <= 4 ? '#F59E0B' : '#EF4444';
              return `
                const marker${index} = new google.maps.Marker({
                  position: { lat: ${report.latitude}, lng: ${report.longitude} },
                  map: map,
                  icon: {
                    path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z',
                    fillColor: '${severityColor}',
                    fillOpacity: 1,
                    strokeColor: '#ffffff',
                    strokeWeight: 2,
                    scale: 2
                  },
                  animation: google.maps.Animation.DROP
                });
                
                marker${index}.addListener('click', function() {
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'markerClick',
                    reportId: '${report.id}'
                  }));
                });
              `;
            }).join('')}
        }
      </script>
      <script async defer src="https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap"></script>
    </body>
    </html>
  `, [lat, lng, filteredReports, user?.uid]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1B365D" />
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'markerClick') {
        const report = symptomReports.find(r => r.id === data.reportId);
        if (report) {
          setSelectedReport({
            ...report,
            isUserReport: report.userId === user?.uid
          } as SymptomReport & {isUserReport: boolean});
        }
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Filter Controls */}
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowSeverityDropdown(!showSeverityDropdown)}
        >
          <Filter size={16} color="#1B365D" />
          <Text style={styles.filterText}>Severity: {severityFilter}</Text>
          <ChevronDown size={16} color="#1B365D" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowOwnershipDropdown(!showOwnershipDropdown)}
        >
          <User size={16} color="#1B365D" />
          <Text style={styles.filterText}>Reports: {ownershipFilter}</Text>
          <ChevronDown size={16} color="#1B365D" />
        </TouchableOpacity>
      </View>

      <WebView
        ref={webViewRef}
        source={{ html: mapHtml }}
        style={styles.fullMap}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={handleWebViewMessage}
      />
      <Modal
        visible={selectedReport !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedReport(null)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSelectedReport(null)}
        >
          <TouchableOpacity 
            style={styles.modalContent}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            {selectedReport && (
              <>
                <View style={styles.modalHeader}>
                  <View style={styles.modalTitleContainer}>
                    <Text style={styles.modalTitle}>
                      {selectedReport.reportType === 'observed' ? 'Observed' : 'Experienced'} Report
                    </Text>
                    {(selectedReport as any).isUserReport && (
                      <View style={styles.yourReportBadge}>
                        <Text style={styles.yourReportBadgeText}>YOUR REPORT</Text>
                      </View>
                    )}
                  </View>
                  <TouchableOpacity onPress={() => setSelectedReport(null)}>
                    <X size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.modalStatusContainer}>
                  <View style={[
                    styles.modalStatus,
                    { backgroundColor: selectedReport.status === 'verified' ? '#10B981' : selectedReport.status === 'pending' ? '#F59E0B' : '#6B7280' }
                  ]}>
                    <Text style={styles.modalStatusText}>{selectedReport.status.toUpperCase()}</Text>
                  </View>
                </View>

                <Text style={styles.modalSectionTitle}>Symptoms:</Text>
                <Text style={styles.modalSectionContent}>
                  {selectedReport.symptoms.join(', ')}
                  {selectedReport.customSymptom && `, ${selectedReport.customSymptom}`}
                </Text>

                <View style={styles.modalDetails}>
                  <View style={styles.modalDetailItem}>
                    <User size={14} color="#6B7280" />
                    <Text style={styles.modalDetailText}>
                      {(selectedReport as any).isUserReport ? 'You' : selectedReport.userName}
                    </Text>
                  </View>
                  <View style={styles.modalDetailItem}>
                    <Calendar size={14} color="#6B7280" />
                    <Text style={styles.modalDetailText}>
                      {selectedReport.createdAt?.toDate?.()?.toLocaleDateString() || 'Recent'}
                    </Text>
                  </View>
                </View>
              </>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Severity Dropdown */}
      {showSeverityDropdown && (
        <Modal transparent={true} visible={showSeverityDropdown} onRequestClose={() => setShowSeverityDropdown(false)}>
          <TouchableOpacity style={styles.dropdownOverlay} onPress={() => setShowSeverityDropdown(false)}>
            <View style={styles.dropdown}>
              {['all', 'low', 'medium', 'high'].map(severity => (
                <TouchableOpacity 
                  key={severity}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSeverityFilter(severity as any);
                    setShowSeverityDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownText}>{severity}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {/* Ownership Dropdown */}
      {showOwnershipDropdown && (
        <Modal transparent={true} visible={showOwnershipDropdown} onRequestClose={() => setShowOwnershipDropdown(false)}>
          <TouchableOpacity style={styles.dropdownOverlay} onPress={() => setShowOwnershipDropdown(false)}>
            <View style={styles.dropdown}>
              {[{key: 'all', label: 'All Reports'}, {key: 'yours', label: 'Your Reports'}, {key: 'others', label: 'Other Reports'}].map(item => (
                <TouchableOpacity 
                  key={item.key}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setOwnershipFilter(item.key as any);
                    setShowOwnershipDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
    fontWeight: '500',
  },
  fullMap: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    gap: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  filterText: {
    fontSize: 12,
    color: '#1B365D',
    fontWeight: '500',
  },
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    backgroundColor: 'white',
    borderRadius: 8,
    minWidth: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownText: {
    fontSize: 14,
    color: '#1B365D',
    textTransform: 'capitalize',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 2,
    padding: 20,
    width: '100%',
    maxHeight: '60%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B365D',
  },
  yourReportBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  yourReportBadgeText: {
    color: 'white',
    fontSize: 9,
    fontWeight: 'bold',
  },
  modalStatusContainer: {
    marginBottom: 16,
  },
  modalStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  modalStatusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B365D',
    marginBottom: 8,
  },
  modalSectionContent: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 16,
  },
  modalDetails: {
    gap: 8,
  },
  modalDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalDetailText: {
    fontSize: 14,
    color: '#6B7280',
  },
});