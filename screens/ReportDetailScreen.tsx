import { View, Text, ScrollView, TouchableOpacity, Image, Platform, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { ChevronLeft, User, Eye, MapPin, Calendar } from 'lucide-react-native';

interface Report {
  id: string;
  reportType: 'self' | 'observed';
  symptoms: string[];
  customSymptom: string;
  description: string;
  location: string;
  barangay: string;
  proofImageUrl: string;
  createdAt: any;
  status: string;
}

interface ReportDetailScreenProps {
  report: Report;
  onBack: () => void;
}

export const ReportDetailScreen = ({ report, onBack }: ReportDetailScreenProps) => {
  const allSymptoms = [...report.symptoms, report.customSymptom].filter(Boolean);
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleBack = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => onBack());
  };

  const getTimeAgo = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 604800)}w ago`;
    return `${Math.floor(seconds / 2592000)}mo ago`;
  };

  const getSeverityColor = (symptomsCount: number) => {
    if (symptomsCount >= 4) return { bg: '#FEE2E2', text: '#DC2626' };
    if (symptomsCount >= 2) return { bg: '#FEF3C7', text: '#D97706' };
    return { bg: '#DBEAFE', text: '#1D4ED8' };
  };

  const colors = getSeverityColor(allSymptoms.length);

  return (
    <Animated.View 
      style={{ 
        flex: 1, 
        backgroundColor: 'white',
        transform: [{ translateX: slideAnim }],
        opacity: fadeAnim,
      }}
    >
      {/* Header */}
      <View style={{ backgroundColor: '#1B365D', paddingTop: Platform.OS === 'ios' ? 30 : 20, paddingBottom: 16, paddingHorizontal: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={handleBack} style={{ padding: 4, marginRight: 12 }}>
            <ChevronLeft size={24} color="white" strokeWidth={2} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white', fontFamily: 'Inter-SemiBold', marginBottom: 2 }}>
              Report Details
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              {report.reportType === 'self' ? (
                <User size={14} color="rgba(255,255,255,0.7)" strokeWidth={2} />
              ) : (
                <Eye size={14} color="rgba(255,255,255,0.7)" strokeWidth={2} />
              )}
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontFamily: 'Inter-Medium' }}>
                {report.reportType === 'self' ? 'Self-reported' : 'Observed'} • {getTimeAgo(report.createdAt)}
              </Text>
            </View>
          </View>
          <View style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6, backgroundColor: colors.bg }}>
            <Text style={{ fontSize: 9, color: colors.text, fontFamily: 'Inter-SemiBold' }}>{allSymptoms.length} SYMPTOMS</Text>
          </View>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 16 }}>
        {/* Symptoms Section */}
        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          <Text style={{ fontSize: 11, color: '#6B7280', fontFamily: 'Inter-SemiBold', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>Reported Symptoms</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {allSymptoms.map((symptom, index) => (
              <View key={index} style={{ backgroundColor: '#F3F4F6', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB' }}>
                <Text style={{ color: '#1F2937', fontSize: 13, fontFamily: 'Inter-SemiBold' }}>{symptom}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Description Section */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <Text style={{ fontSize: 11, color: '#6B7280', fontFamily: 'Inter-SemiBold', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>Description</Text>
          <Text style={{ color: '#374151', fontSize: 14, lineHeight: 22, fontFamily: 'Inter-Medium' }}>{report.description}</Text>
        </View>

        {/* Location Section */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <Text style={{ fontSize: 11, color: '#6B7280', fontFamily: 'Inter-SemiBold', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>Location</Text>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#F9FAFB', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB' }}>
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#DBEAFE', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              <MapPin size={18} color="#1D4ED8" strokeWidth={2} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#1F2937', fontSize: 14, fontFamily: 'Inter-SemiBold', marginBottom: 2 }}>{report.location}</Text>
              <Text style={{ color: '#6B7280', fontSize: 12, fontFamily: 'Inter-Medium' }}>Barangay {report.barangay}</Text>
            </View>
          </View>
        </View>

        {/* Proof Image Section */}
        {report.proofImageUrl && (
          <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
            <Text style={{ fontSize: 11, color: '#6B7280', fontFamily: 'Inter-SemiBold', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>Proof Image</Text>
            <Image source={{ uri: report.proofImageUrl }} style={{ width: '100%', height: 220, borderRadius: 12, backgroundColor: '#F3F4F6' }} resizeMode="cover" />
          </View>
        )}
      </ScrollView>
    </Animated.View>
  );
};
