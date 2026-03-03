import { View, Text, TouchableOpacity, ScrollView, Platform, Linking } from 'react-native';
import { ArrowLeft, Phone, MapPin, Clock, AlertTriangle, Heart, Truck, Shield } from 'lucide-react-native';

interface EmergencyContactsScreenProps {
  onBack: () => void;
}

export const EmergencyContactsScreen = ({ onBack }: EmergencyContactsScreenProps) => {
  const emergencyContacts = [
    {
      id: 1,
      name: 'Emergency Hotline',
      number: '911',
      description: '24/7 Emergency Response',
      icon: AlertTriangle,
      color: '#EF4444',
      type: 'emergency'
    },
    {
      id: 2,
      name: 'Philippine Red Cross',
      number: '143',
      description: 'Disaster Response & First Aid',
      icon: Heart,
      color: '#DC2626',
      type: 'medical'
    },
    {
      id: 3,
      name: 'DOH Health Line',
      number: '1555',
      description: 'Health Information & Assistance',
      icon: Phone,
      color: '#059669',
      type: 'health'
    },
    {
      id: 4,
      name: 'Fire Department',
      number: '116',
      description: 'Fire Emergency Response',
      icon: Truck,
      color: '#DC2626',
      type: 'fire'
    },
    {
      id: 5,
      name: 'PNP Emergency',
      number: '117',
      description: 'Police Emergency Response',
      icon: Shield,
      color: '#1D4ED8',
      type: 'police'
    }
  ];

  const localContacts = [
    {
      id: 1,
      name: 'Barangay Health Station',
      number: '+63 912 345 6789',
      location: 'Barangay San Antonio',
      hours: '8:00 AM - 5:00 PM'
    },
    {
      id: 2,
      name: 'Municipal Health Office',
      number: '+63 923 456 7890',
      location: 'Municipal Hall',
      hours: '24/7'
    },
    {
      id: 3,
      name: 'Rural Health Unit',
      number: '+63 934 567 8901',
      location: 'Poblacion Center',
      hours: '7:00 AM - 7:00 PM'
    }
  ];

  const handleCall = (number: string) => {
    Linking.openURL(`tel:${number}`);
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
          Emergency Contacts
        </Text>
      </View>

      <ScrollView className="flex-1 p-5">
        {/* Emergency Alert */}
        <View className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex-row items-center">
          <AlertTriangle size={24} color="#EF4444" strokeWidth={2} />
          <View className="ml-3 flex-1">
            <Text className="text-red-800 font-semibold" style={{ fontFamily: 'Inter-SemiBold' }}>
              Emergency Alert
            </Text>
            <Text className="text-red-700 text-sm" style={{ fontFamily: 'Inter-Medium' }}>
              In case of emergency, call 911 immediately
            </Text>
          </View>
        </View>

        {/* National Emergency Numbers */}
        <Text className="text-[#1B365D] text-lg font-semibold mb-4" style={{ fontFamily: 'Inter-SemiBold' }}>
          National Emergency Numbers
        </Text>

        {emergencyContacts.map((contact) => {
          const IconComponent = contact.icon;
          return (
            <TouchableOpacity 
              key={contact.id} 
              className="bg-white border border-gray-200 rounded-xl p-4 mb-3"
              onPress={() => handleCall(contact.number)}
            >
              <View className="flex-row items-center">
                <View 
                  className="rounded-full p-3 mr-4"
                  style={{ backgroundColor: `${contact.color}20` }}
                >
                  <IconComponent size={24} color={contact.color} strokeWidth={2} />
                </View>
                
                <View className="flex-1">
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                      <Text className="text-[#1B365D] text-base font-semibold" style={{ fontFamily: 'Inter-SemiBold' }}>
                        {contact.name}
                      </Text>
                      <Text className="text-gray-600 text-sm" style={{ fontFamily: 'Inter-Medium' }}>
                        {contact.description}
                      </Text>
                    </View>
                    <View className="bg-[#1B365D] rounded-lg px-3 py-2">
                      <Text className="text-white font-bold" style={{ fontFamily: 'Inter-SemiBold' }}>
                        {contact.number}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Local Health Contacts */}
        <Text className="text-[#1B365D] text-lg font-semibold mb-4 mt-6" style={{ fontFamily: 'Inter-SemiBold' }}>
          Local Health Contacts
        </Text>

        {localContacts.map((contact) => (
          <TouchableOpacity 
            key={contact.id} 
            className="bg-white border border-gray-200 rounded-xl p-4 mb-3"
            onPress={() => handleCall(contact.number)}
          >
            <View className="flex-row justify-between items-start mb-2">
              <Text className="text-[#1B365D] text-base font-semibold flex-1" style={{ fontFamily: 'Inter-SemiBold' }}>
                {contact.name}
              </Text>
              <TouchableOpacity 
                className="bg-green-600 rounded-lg px-3 py-1"
                onPress={() => handleCall(contact.number)}
              >
                <Text className="text-white text-sm font-semibold" style={{ fontFamily: 'Inter-SemiBold' }}>
                  Call
                </Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center mb-1">
              <MapPin size={14} color="#6B7280" strokeWidth={2} />
              <Text className="text-gray-600 text-sm ml-2" style={{ fontFamily: 'Inter-Medium' }}>
                {contact.location}
              </Text>
            </View>

            <View className="flex-row items-center">
              <Clock size={14} color="#6B7280" strokeWidth={2} />
              <Text className="text-gray-600 text-sm ml-2" style={{ fontFamily: 'Inter-Medium' }}>
                {contact.hours}
              </Text>
            </View>

            <Text className="text-gray-500 text-xs mt-2" style={{ fontFamily: 'Inter-Medium' }}>
              {contact.number}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Quick Tips */}
        <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
          <Text className="text-blue-800 font-semibold mb-2" style={{ fontFamily: 'Inter-SemiBold' }}>
            Emergency Tips
          </Text>
          <Text className="text-blue-700 text-sm" style={{ fontFamily: 'Inter-Medium' }}>
            • Stay calm and speak clearly{'\n'}
            • Provide your exact location{'\n'}
            • Describe the emergency situation{'\n'}
            • Follow the operator's instructions
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};