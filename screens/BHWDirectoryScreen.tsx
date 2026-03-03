import { View, Text, TouchableOpacity, ScrollView, Platform, Image } from 'react-native';
import { ArrowLeft, Phone, MapPin, Clock, Star, MessageCircle } from 'lucide-react-native';

interface BHWDirectoryScreenProps {
  onBack: () => void;
}

export const BHWDirectoryScreen = ({ onBack }: BHWDirectoryScreenProps) => {
  const bhws = [
    {
      id: 1,
      name: 'Maria Santos',
      barangay: 'Barangay San Antonio',
      phone: '+63 912 345 6789',
      specialization: 'Maternal Health',
      rating: 4.8,
      status: 'Available',
      experience: '5 years'
    },
    {
      id: 2,
      name: 'Juan Dela Cruz',
      barangay: 'Barangay Poblacion',
      phone: '+63 923 456 7890',
      specialization: 'Child Health',
      rating: 4.9,
      status: 'Busy',
      experience: '8 years'
    },
    {
      id: 3,
      name: 'Ana Rodriguez',
      barangay: 'Barangay Riverside',
      phone: '+63 934 567 8901',
      specialization: 'Senior Care',
      rating: 4.7,
      status: 'Available',
      experience: '3 years'
    },
    {
      id: 4,
      name: 'Carlos Mendoza',
      barangay: 'Barangay Central',
      phone: '+63 945 678 9012',
      specialization: 'Emergency Response',
      rating: 4.9,
      status: 'Available',
      experience: '6 years'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return '#10B981';
      case 'Busy': return '#F59E0B';
      case 'Offline': return '#6B7280';
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
          BHW Directory
        </Text>
      </View>

      <ScrollView className="flex-1 p-5">
        {/* Quick Stats */}
        <View className="bg-gray-50 rounded-xl p-4 mb-6">
          <Text className="text-[#1B365D] text-lg font-semibold mb-3" style={{ fontFamily: 'Inter-SemiBold' }}>
            BHW Network
          </Text>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-2xl font-bold text-[#1B365D]" style={{ fontFamily: 'Inter-SemiBold' }}>12</Text>
              <Text className="text-gray-600 text-sm" style={{ fontFamily: 'Inter-Medium' }}>Total BHWs</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-green-600" style={{ fontFamily: 'Inter-SemiBold' }}>8</Text>
              <Text className="text-gray-600 text-sm" style={{ fontFamily: 'Inter-Medium' }}>Available</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-[#20A0D8]" style={{ fontFamily: 'Inter-SemiBold' }}>4.8</Text>
              <Text className="text-gray-600 text-sm" style={{ fontFamily: 'Inter-Medium' }}>Avg Rating</Text>
            </View>
          </View>
        </View>

        {/* BHW List */}
        <Text className="text-[#1B365D] text-lg font-semibold mb-4" style={{ fontFamily: 'Inter-SemiBold' }}>
          Barangay Health Workers
        </Text>

        {bhws.map((bhw) => (
          <View key={bhw.id} className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
            <View className="flex-row items-start">
              {/* Avatar */}
              <View className="bg-[#1B365D] rounded-full w-12 h-12 items-center justify-center mr-3">
                <Text className="text-white font-bold text-lg" style={{ fontFamily: 'Inter-SemiBold' }}>
                  {bhw.name.split(' ').map(n => n[0]).join('')}
                </Text>
              </View>

              <View className="flex-1">
                {/* Name and Status */}
                <View className="flex-row justify-between items-start mb-1">
                  <Text className="text-[#1B365D] text-base font-semibold" style={{ fontFamily: 'Inter-SemiBold' }}>
                    {bhw.name}
                  </Text>
                  <View className="flex-row items-center">
                    <View 
                      className="w-2 h-2 rounded-full mr-2"
                      style={{ backgroundColor: getStatusColor(bhw.status) }}
                    />
                    <Text 
                      className="text-sm font-medium"
                      style={{ color: getStatusColor(bhw.status), fontFamily: 'Inter-Medium' }}
                    >
                      {bhw.status}
                    </Text>
                  </View>
                </View>

                {/* Specialization */}
                <Text className="text-[#20A0D8] text-sm font-medium mb-2" style={{ fontFamily: 'Inter-Medium' }}>
                  {bhw.specialization}
                </Text>

                {/* Location */}
                <View className="flex-row items-center mb-2">
                  <MapPin size={14} color="#6B7280" strokeWidth={2} />
                  <Text className="text-gray-600 text-sm ml-1" style={{ fontFamily: 'Inter-Medium' }}>
                    {bhw.barangay}
                  </Text>
                </View>

                {/* Rating and Experience */}
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center">
                    <Star size={14} color="#F59E0B" strokeWidth={2} fill="#F59E0B" />
                    <Text className="text-gray-600 text-sm ml-1" style={{ fontFamily: 'Inter-Medium' }}>
                      {bhw.rating} • {bhw.experience}
                    </Text>
                  </View>
                </View>

                {/* Action Buttons */}
                <View className="flex-row gap-2">
                  <TouchableOpacity 
                    className="flex-1 bg-[#1B365D] rounded-lg py-2 px-3 flex-row items-center justify-center"
                    disabled={bhw.status === 'Busy'}
                    style={{ opacity: bhw.status === 'Busy' ? 0.5 : 1 }}
                  >
                    <Phone size={16} color="white" strokeWidth={2} />
                    <Text className="text-white text-sm font-medium ml-2" style={{ fontFamily: 'Inter-Medium' }}>
                      Call
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    className="flex-1 bg-[#20A0D8] rounded-lg py-2 px-3 flex-row items-center justify-center"
                    disabled={bhw.status === 'Busy'}
                    style={{ opacity: bhw.status === 'Busy' ? 0.5 : 1 }}
                  >
                    <MessageCircle size={16} color="white" strokeWidth={2} />
                    <Text className="text-white text-sm font-medium ml-2" style={{ fontFamily: 'Inter-Medium' }}>
                      Message
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};