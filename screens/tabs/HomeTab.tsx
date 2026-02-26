import { View, Text, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useAuth } from '../../context';
import { Shield, Eye, MapPin, ChevronRight, AlertTriangle, CheckCircle, Star, Award } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';

export const HomeTab = () => {
  const { user } = useAuth();
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

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
        <View style={{ backgroundColor: '#1B365D', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 30, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
          <Animated.View style={{ width: 150, height: 20, backgroundColor: '#2B4A6D', borderRadius: 4, marginBottom: 12, opacity: shimmerOpacity }} />
          <Animated.View style={{ width: 200, height: 28, backgroundColor: '#2B4A6D', borderRadius: 4, marginBottom: 8, opacity: shimmerOpacity }} />
          <Animated.View style={{ width: 120, height: 16, backgroundColor: '#2B4A6D', borderRadius: 4, opacity: shimmerOpacity }} />
        </View>
        <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginTop: -20, gap: 12 }}>
          <Animated.View style={{ flex: 1, backgroundColor: 'white', borderRadius: 12, height: 100, opacity: shimmerOpacity }} />
          <Animated.View style={{ flex: 1, backgroundColor: 'white', borderRadius: 12, height: 100, opacity: shimmerOpacity }} />
        </View>
        <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
          <Animated.View style={{ width: 150, height: 20, backgroundColor: '#E5E7EB', borderRadius: 4, marginBottom: 12, opacity: shimmerOpacity }} />
          <Animated.View style={{ width: '100%', height: 120, backgroundColor: '#E5E7EB', borderRadius: 12, opacity: shimmerOpacity }} />
        </View>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Welcome Section */}
      <View style={{ backgroundColor: '#1B365D', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 30, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <Shield size={24} color="#20A0D8" strokeWidth={2} />
          <Text className="text-white text-lg ml-2" style={{ fontFamily: 'Inter-Medium' }}>Community Sentinel</Text>
        </View>
        <Text className="text-white text-2xl font-bold" style={{ fontFamily: 'Inter-SemiBold' }}>
          {user?.firstName} {user?.lastName}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
          <Star size={16} color="#FFD700" fill="#FFD700" />
          <Text className="text-white text-sm ml-1" style={{ fontFamily: 'Inter-Medium' }}>Trust Score: 87/100</Text>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginTop: -20, gap: 12 }}>
        <View style={{ flex: 1, backgroundColor: 'white', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
          <Eye size={24} color="#20A0D8" strokeWidth={2} />
          <Text className="text-gray-600 text-xs mt-2" style={{ fontFamily: 'Inter-Medium' }}>Observations</Text>
          <Text className="text-[#1B365D] text-xl font-bold" style={{ fontFamily: 'Inter-SemiBold' }}>47</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: 'white', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
          <Award size={24} color="#10B981" strokeWidth={2} />
          <Text className="text-gray-600 text-xs mt-2" style={{ fontFamily: 'Inter-Medium' }}>Load Credits</Text>
          <Text className="text-[#1B365D] text-xl font-bold" style={{ fontFamily: 'Inter-SemiBold' }}>₱125</Text>
        </View>
      </View>

      {/* Health Alerts & Advisories */}
      <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text className="text-[#1B365D] text-lg font-semibold" style={{ fontFamily: 'Inter-SemiBold' }}>Health Alerts</Text>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text className="text-[#20A0D8] text-sm" style={{ fontFamily: 'Inter-Medium' }}>See all</Text>
            <ChevronRight size={16} color="#20A0D8" />
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, paddingHorizontal: 20 }}>
          <View style={{ width: 280, backgroundColor: 'white', borderRadius: 12, padding: 16, marginRight: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2, borderLeftWidth: 4, borderLeftColor: '#EF4444' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <AlertTriangle size={20} color="#EF4444" strokeWidth={2} />
              <Text className="text-[#EF4444] font-semibold ml-2" style={{ fontFamily: 'Inter-SemiBold' }}>Cluster Alert</Text>
            </View>
            <Text className="text-gray-700 text-sm" style={{ fontFamily: 'Inter-Medium' }}>3 sentinels reported fever symptoms in Purok 2. Health team dispatched.</Text>
            <Text className="text-gray-500 text-xs mt-2" style={{ fontFamily: 'Inter-Medium' }}>15 minutes ago • Brgy. San Antonio</Text>
          </View>
          <View style={{ width: 280, backgroundColor: 'white', borderRadius: 12, padding: 16, marginRight: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2, borderLeftWidth: 4, borderLeftColor: '#10B981' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <CheckCircle size={20} color="#10B981" strokeWidth={2} />
              <Text className="text-[#10B981] font-semibold ml-2" style={{ fontFamily: 'Inter-SemiBold' }}>Advisory</Text>
            </View>
            <Text className="text-gray-700 text-sm" style={{ fontFamily: 'Inter-Medium' }}>Dengue prevention campaign starts Monday. Free larvicide distribution.</Text>
            <Text className="text-gray-500 text-xs mt-2" style={{ fontFamily: 'Inter-Medium' }}>2 hours ago • Municipal Health Office</Text>
          </View>
        </ScrollView>
      </View>

      {/* Observation Heatmap */}
      <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text className="text-[#1B365D] text-lg font-semibold" style={{ fontFamily: 'Inter-SemiBold' }}>Area Heatmap</Text>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text className="text-[#20A0D8] text-sm" style={{ fontFamily: 'Inter-Medium' }}>View map</Text>
            <ChevronRight size={16} color="#20A0D8" />
          </TouchableOpacity>
        </View>
        <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <MapPin size={20} color="#1B365D" strokeWidth={2} />
            <Text className="text-[#1B365D] font-semibold ml-2" style={{ fontFamily: 'Inter-SemiBold' }}>Your Coverage Area</Text>
          </View>
          <Text className="text-gray-700 text-sm mb-3" style={{ fontFamily: 'Inter-Medium' }}>Brgy. San Antonio - Purok 1, 2, 3</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <View style={{ flex: 1, backgroundColor: '#FEF3C7', borderRadius: 8, padding: 8, alignItems: 'center' }}>
              <Text className="text-[#D97706] text-xs font-semibold" style={{ fontFamily: 'Inter-SemiBold' }}>MODERATE</Text>
              <Text className="text-[#D97706] text-lg font-bold" style={{ fontFamily: 'Inter-SemiBold' }}>7</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: '#DCFCE7', borderRadius: 8, padding: 8, alignItems: 'center' }}>
              <Text className="text-[#16A34A] text-xs font-semibold" style={{ fontFamily: 'Inter-SemiBold' }}>LOW</Text>
              <Text className="text-[#16A34A] text-lg font-bold" style={{ fontFamily: 'Inter-SemiBold' }}>2</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Recent Observations */}
      <View style={{ paddingHorizontal: 20, marginTop: 24, marginBottom: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text className="text-[#1B365D] text-lg font-semibold" style={{ fontFamily: 'Inter-SemiBold' }}>Your Observations</Text>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text className="text-[#20A0D8] text-sm" style={{ fontFamily: 'Inter-Medium' }}>View all</Text>
            <ChevronRight size={16} color="#20A0D8" />
          </TouchableOpacity>
        </View>
        <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#FEF3C7', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              <Eye size={24} color="#D97706" strokeWidth={2} />
            </View>
            <View style={{ flex: 1 }}>
              <Text className="text-[#1B365D] font-semibold" style={{ fontFamily: 'Inter-SemiBold' }}>Fever symptoms observed</Text>
              <Text className="text-gray-500 text-xs mt-1" style={{ fontFamily: 'Inter-Medium' }}>Today at 2:15 PM • Validated by 2 other sentinels</Text>
            </View>
            <View style={{ backgroundColor: '#FEF3C7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 }}>
              <Text className="text-[#D97706] text-xs font-semibold" style={{ fontFamily: 'Inter-SemiBold' }}>PENDING</Text>
            </View>
          </View>
        </View>
        <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#DCFCE7', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              <CheckCircle size={24} color="#16A34A" strokeWidth={2} />
            </View>
            <View style={{ flex: 1 }}>
              <Text className="text-[#1B365D] font-semibold" style={{ fontFamily: 'Inter-SemiBold' }}>Wellness check completed</Text>
              <Text className="text-gray-500 text-xs mt-1" style={{ fontFamily: 'Inter-Medium' }}>Yesterday at 4:30 PM • +₱15 load credit earned</Text>
            </View>
            <View style={{ backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 }}>
              <Text className="text-[#16A34A] text-xs font-semibold" style={{ fontFamily: 'Inter-SemiBold' }}>VERIFIED</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
