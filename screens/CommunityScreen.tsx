import { View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { ArrowLeft, Users, MessageCircle, Calendar, MapPin } from 'lucide-react-native';

interface CommunityScreenProps {
  onBack: () => void;
}

export const CommunityScreen = ({ onBack }: CommunityScreenProps) => {
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
          Community
        </Text>
      </View>

      <ScrollView className="flex-1 p-5">
        {/* Community Stats */}
        <View className="bg-gray-50 rounded-xl p-4 mb-6">
          <Text className="text-[#1B365D] text-lg font-semibold mb-3" style={{ fontFamily: 'Inter-SemiBold' }}>
            Community Overview
          </Text>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-2xl font-bold text-[#1B365D]" style={{ fontFamily: 'Inter-SemiBold' }}>1,247</Text>
              <Text className="text-gray-600 text-sm" style={{ fontFamily: 'Inter-Medium' }}>Members</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-[#20A0D8]" style={{ fontFamily: 'Inter-SemiBold' }}>23</Text>
              <Text className="text-gray-600 text-sm" style={{ fontFamily: 'Inter-Medium' }}>Active Reports</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-green-600" style={{ fontFamily: 'Inter-SemiBold' }}>5</Text>
              <Text className="text-gray-600 text-sm" style={{ fontFamily: 'Inter-Medium' }}>BHWs Online</Text>
            </View>
          </View>
        </View>

        {/* Community Features */}
        <TouchableOpacity className="bg-white border border-gray-200 rounded-xl p-4 mb-4 flex-row items-center">
          <View className="bg-blue-100 rounded-full p-3 mr-4">
            <MessageCircle size={24} color="#1B365D" strokeWidth={2} />
          </View>
          <View className="flex-1">
            <Text className="text-[#1B365D] text-base font-semibold" style={{ fontFamily: 'Inter-SemiBold' }}>
              Community Forum
            </Text>
            <Text className="text-gray-600 text-sm" style={{ fontFamily: 'Inter-Medium' }}>
              Discuss health topics with neighbors
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity className="bg-white border border-gray-200 rounded-xl p-4 mb-4 flex-row items-center">
          <View className="bg-green-100 rounded-full p-3 mr-4">
            <Calendar size={24} color="#1B365D" strokeWidth={2} />
          </View>
          <View className="flex-1">
            <Text className="text-[#1B365D] text-base font-semibold" style={{ fontFamily: 'Inter-SemiBold' }}>
              Health Events
            </Text>
            <Text className="text-gray-600 text-sm" style={{ fontFamily: 'Inter-Medium' }}>
              Upcoming vaccination drives & checkups
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity className="bg-white border border-gray-200 rounded-xl p-4 mb-4 flex-row items-center">
          <View className="bg-purple-100 rounded-full p-3 mr-4">
            <MapPin size={24} color="#1B365D" strokeWidth={2} />
          </View>
          <View className="flex-1">
            <Text className="text-[#1B365D] text-base font-semibold" style={{ fontFamily: 'Inter-SemiBold' }}>
              Barangay Map
            </Text>
            <Text className="text-gray-600 text-sm" style={{ fontFamily: 'Inter-Medium' }}>
              View health facilities & services nearby
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity className="bg-white border border-gray-200 rounded-xl p-4 mb-4 flex-row items-center">
          <View className="bg-orange-100 rounded-full p-3 mr-4">
            <Users size={24} color="#1B365D" strokeWidth={2} />
          </View>
          <View className="flex-1">
            <Text className="text-[#1B365D] text-base font-semibold" style={{ fontFamily: 'Inter-SemiBold' }}>
              Volunteer Network
            </Text>
            <Text className="text-gray-600 text-sm" style={{ fontFamily: 'Inter-Medium' }}>
              Join community health initiatives
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};