import { View, Text, TouchableOpacity, Dimensions, Platform, Animated, Image } from 'react-native';
import { Users, Shield, Settings, LogOut, AlertTriangle, Phone, Info, Award } from 'lucide-react-native';
import { useAuth } from '../../context';

const { width } = Dimensions.get('window');

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  drawerAnim: Animated.Value;
}

export const Drawer = ({ isOpen, onClose, drawerAnim }: DrawerProps) => {
  const { user, logout } = useAuth();

  return (
    <>
      {isOpen && (
        <TouchableOpacity 
          activeOpacity={1}
          onPress={onClose}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100 }}
        />
      )}

      <Animated.View 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          bottom: 0, 
          width: width * 0.7, 
          backgroundColor: 'white',
          transform: [{ translateX: drawerAnim }],
          zIndex: 101,
          shadowColor: '#000',
          shadowOffset: { width: 2, height: 0 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 5
        }}
      >
        <View style={{ paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingHorizontal: 20, paddingBottom: 15, backgroundColor: '#1B365D' }}>
          <View className="flex-row items-center">
            {user?.documents?.selfieUrl ? (
              <Image 
                source={{ uri: user.documents.selfieUrl }} 
                style={{ width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: 'white', marginRight: 12 }}
                resizeMode="cover"
              />
            ) : (
              <View className="bg-white rounded-full w-12 h-12 items-center justify-center mr-3">
                <Text className="text-[#1B365D] font-bold text-xl" style={{ fontFamily: 'Inter-SemiBold' }}>
                  {user?.firstName?.charAt(0) || 'U'}
                </Text>
              </View>
            )}
            <View>
              <Text className="text-white font-semibold text-base" style={{ fontFamily: 'Inter-SemiBold' }}>
                {user?.firstName} {user?.lastName}
              </Text>
              <Text className="text-white/70 text-xs" style={{ fontFamily: 'Inter-Medium' }}>
                Sentinel Resident
              </Text>
            </View>
          </View>
          
          {/* Trust Score */}
          <View style={{ marginTop: 16, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 12 }}>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Award size={20} color="#FFD700" strokeWidth={2} />
                <Text className="text-white font-semibold text-sm ml-2" style={{ fontFamily: 'Inter-SemiBold' }}>Trust Score</Text>
              </View>
              <Text className="text-white font-bold text-xl" style={{ fontFamily: 'Inter-SemiBold' }}>85</Text>
            </View>
            <View style={{ marginTop: 8, backgroundColor: 'rgba(255,255,255,0.2)', height: 6, borderRadius: 3, overflow: 'hidden' }}>
              <View style={{ width: '85%', height: '100%', backgroundColor: '#FFD700' }} />
            </View>
          </View>
        </View>

        <View className="flex-1 px-4 py-6">
          <TouchableOpacity className="flex-row items-center py-3 px-4 rounded-lg">
            <AlertTriangle size={22} color="#1B365D" strokeWidth={2} />
            <Text className="text-[#1B365D] text-base ml-4" style={{ fontFamily: 'Inter-Medium' }}>Recent Outbreaks</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center py-3 px-4 rounded-lg">
            <Users size={22} color="#1B365D" strokeWidth={2} />
            <Text className="text-[#1B365D] text-base ml-4" style={{ fontFamily: 'Inter-Medium' }}>BHW Directory</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center py-3 px-4 rounded-lg">
            <Phone size={22} color="#1B365D" strokeWidth={2} />
            <Text className="text-[#1B365D] text-base ml-4" style={{ fontFamily: 'Inter-Medium' }}>Emergency Contacts</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center py-3 px-4 rounded-lg">
            <Shield size={22} color="#1B365D" strokeWidth={2} />
            <Text className="text-[#1B365D] text-base ml-4" style={{ fontFamily: 'Inter-Medium' }}>Safety Tips</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center py-3 px-4 rounded-lg">
            <Info size={22} color="#1B365D" strokeWidth={2} />
            <Text className="text-[#1B365D] text-base ml-4" style={{ fontFamily: 'Inter-Medium' }}>About</Text>
          </TouchableOpacity>

          <View className="border-t border-gray-200 my-3" />

          <TouchableOpacity className="flex-row items-center py-3 px-4 rounded-lg">
            <Settings size={22} color="#1B365D" strokeWidth={2} />
            <Text className="text-[#1B365D] text-base ml-4" style={{ fontFamily: 'Inter-Medium' }}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={logout} className="flex-row items-center py-3 px-4 rounded-lg">
            <LogOut size={22} color="#EF4444" strokeWidth={2} />
            <Text className="text-red-500 text-base ml-4" style={{ fontFamily: 'Inter-Medium' }}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
};
