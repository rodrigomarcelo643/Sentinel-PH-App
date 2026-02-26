import { View, Text, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { Eye, User, AlertTriangle } from 'lucide-react-native';

export const HistoryTab = () => {
  const [filter, setFilter] = useState<'all' | 'self' | 'observed'>('all');
  const [loading, setLoading] = useState(true);
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(shimmerAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
    setTimeout(() => setLoading(false), 800);
  }, []);

  const shimmerOpacity = shimmerAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.7] });

  const reports = [
    { id: 1, title: 'Fever & Headache', type: 'self', severity: 'moderate', date: 'Dec 15, 2024', symptoms: 'High fever, severe headache' },
    { id: 2, title: 'Neighbor - Dengue Symptoms', type: 'observed', severity: 'high', date: 'Dec 14, 2024', symptoms: 'Rash, joint pain, fever' },
    { id: 3, title: 'Cough & Cold', type: 'self', severity: 'low', date: 'Dec 10, 2024', symptoms: 'Dry cough, runny nose' },
    { id: 4, title: 'Community Member - Flu', type: 'observed', severity: 'moderate', date: 'Dec 8, 2024', symptoms: 'Fever, body aches' },
  ];

  const filtered = filter === 'all' ? reports : reports.filter(r => r.type === filter);

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'high': return { bg: '#FEE2E2', text: '#DC2626', icon: '#EF4444' };
      case 'moderate': return { bg: '#FEF3C7', text: '#D97706', icon: '#F59E0B' };
      case 'low': return { bg: '#DBEAFE', text: '#1D4ED8', icon: '#3B82F6' };
      default: return { bg: '#F3F4F6', text: '#6B7280', icon: '#9CA3AF' };
    }
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

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header Info */}
      <View style={{ backgroundColor: '#1B365D', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24 }}>
        <Text className="text-white text-xl font-bold" style={{ fontFamily: 'Inter-SemiBold' }}>Symptom Reports</Text>
        <Text className="text-white text-sm mt-1" style={{ fontFamily: 'Inter-Medium' }}>Track your symptoms & community health</Text>
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

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        {filtered.map((report) => {
          const colors = getSeverityColor(report.severity);
          return (
            <TouchableOpacity key={report.id} style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                  {report.type === 'self' ? <User size={24} color={colors.icon} strokeWidth={2} /> : <Eye size={24} color={colors.icon} strokeWidth={2} />}
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text className="text-[#1B365D] font-semibold text-base" style={{ fontFamily: 'Inter-SemiBold', flex: 1 }}>{report.title}</Text>
                    <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, backgroundColor: colors.bg }}>
                      <Text style={{ fontSize: 10, color: colors.text, fontFamily: 'Inter-SemiBold' }}>{report.severity.toUpperCase()}</Text>
                    </View>
                  </View>
                  <Text className="text-gray-600 text-sm" style={{ fontFamily: 'Inter-Medium' }}>{report.symptoms}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      {report.type === 'self' ? <User size={12} color="#9CA3AF" /> : <Eye size={12} color="#9CA3AF" />}
                      <Text className="text-gray-400 text-xs" style={{ fontFamily: 'Inter-Medium' }}>{report.type === 'self' ? 'Self-reported' : 'Observed'}</Text>
                    </View>
                    <Text className="text-gray-400 text-xs" style={{ fontFamily: 'Inter-Medium' }}>• {report.date}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};
