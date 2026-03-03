import { View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { ArrowLeft, AlertTriangle, MapPin, Clock, TrendingUp } from 'lucide-react-native';

interface RecentOutbreaksScreenProps {
  onBack: () => void;
}

export const RecentOutbreaksScreen = ({ onBack }: RecentOutbreaksScreenProps) => {
  const outbreaks = [
    {
      id: 1,
      disease: 'Dengue Fever',
      location: 'Barangay San Antonio',
      cases: 12,
      status: 'Active',
      lastUpdate: '2 hours ago',
      severity: 'High'
    },
    {
      id: 2,
      disease: 'Food Poisoning',
      location: 'Barangay Poblacion',
      cases: 8,
      status: 'Monitoring',
      lastUpdate: '1 day ago',
      severity: 'Medium'
    },
    {
      id: 3,
      disease: 'Respiratory Infection',
      location: 'Barangay Riverside',
      cases: 5,
      status: 'Contained',
      lastUpdate: '3 days ago',
      severity: 'Low'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return '#EF4444';
      case 'Medium': return '#F59E0B';
      case 'Low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return '#EF4444';
      case 'Monitoring': return '#F59E0B';
      case 'Contained': return '#10B981';
      default: return '#6B7280';
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View
        style={{
          paddingTop: Platform.OS === 'ios' ? 60 : 45,
          paddingBottom: 16,
          paddingHorizontal: 20,
          backgroundColor: '#1B365D',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity onPress={onBack} style={{ marginRight: 16 }}>
          <ArrowLeft size={24} color="white" strokeWidth={2} />
        </TouchableOpacity>
        <Text className="text-white text-xl font-semibold" style={{ fontFamily: 'Inter-SemiBold' }}>
          Recent Outbreaks
        </Text>
      </View>

      <ScrollView className="flex-1 p-5">
        {/* Alert Banner */}
        <View className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex-row items-center">
          <AlertTriangle size={24} color="#EF4444" strokeWidth={2} />
          <View className="ml-3 flex-1">
            <Text className="text-red-800 font-semibold" style={{ fontFamily: 'Inter-SemiBold' }}>
              Health Alert
            </Text>
            <Text className="text-red-700 text-sm" style={{ fontFamily: 'Inter-Medium' }}>
              3 active outbreaks in your area. Stay vigilant and follow health protocols.
            </Text>
          </View>
        </View>

        {/* Statistics */}
        <View className="bg-gray-50 rounded-xl p-4 mb-6">
          <Text className="text-[#1B365D] text-lg font-semibold mb-3" style={{ fontFamily: 'Inter-SemiBold' }}>
            Outbreak Statistics
          </Text>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-2xl font-bold text-red-600" style={{ fontFamily: 'Inter-SemiBold' }}>25</Text>
              <Text className="text-gray-600 text-sm" style={{ fontFamily: 'Inter-Medium' }}>Total Cases</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-orange-600" style={{ fontFamily: 'Inter-SemiBold' }}>3</Text>
              <Text className="text-gray-600 text-sm" style={{ fontFamily: 'Inter-Medium' }}>Active Outbreaks</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-green-600" style={{ fontFamily: 'Inter-SemiBold' }}>7</Text>
              <Text className="text-gray-600 text-sm" style={{ fontFamily: 'Inter-Medium' }}>Days Avg</Text>
            </View>
          </View>
        </View>

        {/* Outbreak List */}
        <Text className="text-[#1B365D] text-lg font-semibold mb-4" style={{ fontFamily: 'Inter-SemiBold' }}>
          Current Outbreaks
        </Text>

        {outbreaks.map((outbreak) => (
          <TouchableOpacity key={outbreak.id} className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
            <View className="flex-row justify-between items-start mb-2">
              <Text className="text-[#1B365D] text-base font-semibold flex-1" style={{ fontFamily: 'Inter-SemiBold' }}>
                {outbreak.disease}
              </Text>
              <View 
                className="px-2 py-1 rounded-full"
                style={{ backgroundColor: `${getSeverityColor(outbreak.severity)}20` }}
              >
                <Text 
                  className="text-xs font-semibold"
                  style={{ color: getSeverityColor(outbreak.severity), fontFamily: 'Inter-SemiBold' }}
                >
                  {outbreak.severity}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center mb-2">
              <MapPin size={16} color="#6B7280" strokeWidth={2} />
              <Text className="text-gray-600 text-sm ml-2" style={{ fontFamily: 'Inter-Medium' }}>
                {outbreak.location}
              </Text>
            </View>

            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <TrendingUp size={16} color="#6B7280" strokeWidth={2} />
                <Text className="text-gray-600 text-sm ml-2" style={{ fontFamily: 'Inter-Medium' }}>
                  {outbreak.cases} cases
                </Text>
              </View>

              <View className="flex-row items-center">
                <View 
                  className="w-2 h-2 rounded-full mr-2"
                  style={{ backgroundColor: getStatusColor(outbreak.status) }}
                />
                <Text 
                  className="text-sm font-medium"
                  style={{ color: getStatusColor(outbreak.status), fontFamily: 'Inter-Medium' }}
                >
                  {outbreak.status}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center mt-2 pt-2 border-t border-gray-100">
              <Clock size={14} color="#9CA3AF" strokeWidth={2} />
              <Text className="text-gray-400 text-xs ml-1" style={{ fontFamily: 'Inter-Medium' }}>
                Updated {outbreak.lastUpdate}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};