import { View, Text, ScrollView, TouchableOpacity, Animated, Image, Modal, ActivityIndicator } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { Eye, User, AlertTriangle, X, Bot, Sparkles } from 'lucide-react-native';
import { useAuth } from '../../context';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ReportDetailScreen } from '../ReportDetailScreen';

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

interface HistoryTabProps {
  onNavigateToAiDoctor: () => void;
}

export const HistoryTab = ({ onNavigateToAiDoctor }: HistoryTabProps) => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'self' | 'observed'>('all');
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [displayCount, setDisplayCount] = useState(10);
  const [loadingMore, setLoadingMore] = useState(false);
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(shimmerAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 1500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const q = query(
        collection(db, 'symptomReports'),
        where('userId', '==', user?.uid)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Report[];
      // Sort by createdAt in memory
      data.sort((a, b) => {
        const aTime = a.createdAt?.toDate?.() || new Date(0);
        const bTime = b.createdAt?.toDate?.() || new Date(0);
        return bTime.getTime() - aTime.getTime();
      });
      setReports(data);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
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

  const shimmerOpacity = shimmerAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.7] });

  const filtered = filter === 'all' ? reports : reports.filter(r => r.reportType === filter);
  const displayedReports = filtered.slice(0, displayCount);
  const hasMore = displayedReports.length < filtered.length;

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      setTimeout(() => {
        setDisplayCount(prev => prev + 10);
        setLoadingMore(false);
      }, 500);
    }
  };

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
      handleLoadMore();
    }
  };

  const getSeverityColor = (symptomsCount: number) => {
    if (symptomsCount >= 4) return { bg: '#FEE2E2', text: '#DC2626', icon: '#EF4444' };
    if (symptomsCount >= 2) return { bg: '#FEF3C7', text: '#D97706', icon: '#F59E0B' };
    return { bg: '#DBEAFE', text: '#1D4ED8', icon: '#3B82F6' };
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
        <View style={{ backgroundColor: '#1B365D', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24 }}>
          <Animated.View style={{ width: 180, height: 24, backgroundColor: '#2B4A6D', borderRadius: 4, marginBottom: 8, opacity: shimmerOpacity }} />
          <Animated.View style={{ width: 220, height: 16, backgroundColor: '#2B4A6D', borderRadius: 4, opacity: shimmerOpacity }} />
        </View>
        <View style={{ padding: 20 }}>
          <Animated.View style={{ width: '100%', height: 100, backgroundColor: 'white', borderRadius: 12, marginBottom: 12, opacity: shimmerOpacity }} />
          <Animated.View style={{ width: '100%', height: 100, backgroundColor: 'white', borderRadius: 12, marginBottom: 12, opacity: shimmerOpacity }} />
          <Animated.View style={{ width: '100%', height: 100, backgroundColor: 'white', borderRadius: 12, opacity: shimmerOpacity }} />
        </View>
      </View>
    );
  }

  if (selectedReport) {
    return <ReportDetailScreen report={selectedReport} onBack={() => setSelectedReport(null)} />;
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header Info */}
      <View style={{ backgroundColor: '#1B365D', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24 }}>
        <Text className="text-white text-xl font-bold" style={{ fontFamily: 'Inter-SemiBold' }}>Symptom Reports</Text>
        <Text className="text-white text-sm mt-1" style={{ fontFamily: 'Inter-Medium' }}>Track your symptoms & community health</Text>
        
        {/* AI Doctor Assistant Card */}
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity
            onPress={onNavigateToAiDoctor}
            style={{
              backgroundColor: '#20A0D8',
              borderRadius: 16,
              padding: 16,
              marginTop: 16,
              flexDirection: 'row',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 5
            }}
            activeOpacity={0.8}
          >
            <Image
              source={require('../../assets/images/ai_doctor_icon.png')}
              style={{ width: 48, height: 48, borderRadius: 24, marginRight: 12 }}
              resizeMode="cover"
            />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                <Text style={{ color: 'white', fontSize: 16, fontFamily: 'Inter-SemiBold' }}>
                  AI Health Assistant
                </Text>
                <Sparkles size={14} color="#FCD34D" style={{ marginLeft: 6 }} />
              </View>
              <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12, fontFamily: 'Inter-Medium' }}>
                Get insights based on your symptoms
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, fontFamily: 'Inter-Medium', marginTop: 4 }}>
                ⚠️ For guidance only - Not a real doctor
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Filter Tabs */}
      <View style={{ backgroundColor: 'white', paddingTop: 16, paddingBottom: 12, marginTop: -12, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
          <TouchableOpacity onPress={() => setFilter('all')} style={{ paddingVertical: 8, paddingHorizontal: 20, borderRadius: 8, backgroundColor: filter === 'all' ? '#1B365D' : '#F3F4F6' }}>
            <Text style={{ color: filter === 'all' ? 'white' : '#6B7280', fontFamily: 'Inter-SemiBold', fontSize: 13 }}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFilter('self')} style={{ paddingVertical: 8, paddingHorizontal: 20, borderRadius: 8, backgroundColor: filter === 'self' ? '#1B365D' : '#F3F4F6', flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <User size={14} color={filter === 'self' ? 'white' : '#6B7280'} />
            <Text style={{ color: filter === 'self' ? 'white' : '#6B7280', fontFamily: 'Inter-SemiBold', fontSize: 13 }}>My Symptoms</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFilter('observed')} style={{ paddingVertical: 8, paddingHorizontal: 20, borderRadius: 8, backgroundColor: filter === 'observed' ? '#1B365D' : '#F3F4F6', flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Eye size={14} color={filter === 'observed' ? 'white' : '#6B7280'} />
            <Text style={{ color: filter === 'observed' ? 'white' : '#6B7280', fontFamily: 'Inter-SemiBold', fontSize: 13 }}>Observed</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={{ padding: 20 }}
        onScroll={handleScroll}
        scrollEventThrottle={400}
      >
        {filtered.length === 0 ? (
          <View style={{ alignItems: 'center', paddingTop: 40 }}>
            <AlertTriangle size={48} color="#9CA3AF" />
            <Text style={{ color: '#6B7280', fontSize: 16, fontFamily: 'Inter-Medium', marginTop: 12 }}>No reports found</Text>
          </View>
        ) : (
          <>
            {displayedReports.map((report) => {
            const allSymptoms = [...report.symptoms, report.customSymptom].filter(Boolean);
            const colors = getSeverityColor(allSymptoms.length);
            const title = report.reportType === 'self' ? allSymptoms.slice(0, 2).join(' & ') : `Observed - ${allSymptoms[0] || 'Symptoms'}`;
            
            return (
              <TouchableOpacity 
                key={report.id} 
                onPress={() => setSelectedReport(report)}
                style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                  <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                    {report.reportType === 'self' ? <User size={24} color={colors.icon} strokeWidth={2} /> : <Eye size={24} color={colors.icon} strokeWidth={2} />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <Text className="text-[#1B365D] font-semibold text-base" style={{ fontFamily: 'Inter-SemiBold', flex: 1 }}>{title}</Text>
                      <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, backgroundColor: colors.bg }}>
                        <Text style={{ fontSize: 10, color: colors.text, fontFamily: 'Inter-SemiBold' }}>{allSymptoms.length} SYMPTOMS</Text>
                      </View>
                    </View>
                    <Text className="text-gray-600 text-sm" style={{ fontFamily: 'Inter-Medium' }} numberOfLines={2}>{report.description}</Text>
                    {report.proofImageUrl && (
                      <TouchableOpacity onPress={() => setSelectedImage(report.proofImageUrl)} style={{ marginTop: 8 }}>
                        <Image source={{ uri: report.proofImageUrl }} style={{ width: 80, height: 80, borderRadius: 8 }} resizeMode="cover" />
                      </TouchableOpacity>
                    )}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        {report.reportType === 'self' ? <User size={12} color="#9CA3AF" /> : <Eye size={12} color="#9CA3AF" />}
                        <Text className="text-gray-400 text-xs" style={{ fontFamily: 'Inter-Medium' }}>{report.reportType === 'self' ? 'Self-reported' : 'Observed'}</Text>
                      </View>
                      <Text className="text-gray-400 text-xs" style={{ fontFamily: 'Inter-Medium' }}>• {getTimeAgo(report.createdAt)}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
          {loadingMore && (
            <View style={{ paddingVertical: 20, alignItems: 'center' }}>
              <ActivityIndicator size="small" color="#1B365D" />
            </View>
          )}
          </>
        )}
      </ScrollView>

      {/* Image Viewer Modal */}
      <Modal visible={!!selectedImage} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => setSelectedImage(null)} style={{ position: 'absolute', top: 50, right: 20, zIndex: 10, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: 8 }}>
            <X size={24} color="white" strokeWidth={2} />
          </TouchableOpacity>
          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={{ width: '90%', height: '70%', borderRadius: 12 }} resizeMode="contain" />
          )}
        </View>
      </Modal>
    </View>
  );
};
