import { View, Text, TouchableOpacity, Dimensions, Platform, Image, Animated } from 'react-native';
import { useState, useRef } from 'react';
import { Home, History, MapPin, User, Plus, Bell, Menu } from 'lucide-react-native';
import { HomeTab, HistoryTab, MapTab, ProfileTab } from './tabs';
import { ReportScreen } from './ReportScreen';
import { AiDoctorAssistantScreen } from './AiDoctorAssistantScreen';
import { Drawer } from '../components/ui';
import { useAuth } from '../context';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

export const HomeScreen = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'history' | 'map' | 'profile' | 'report' | 'aiDoctor'>('home');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user } = useAuth();
  const drawerAnim = useRef(new Animated.Value(-width * 0.7)).current;

  const toggleDrawer = () => {
    if (drawerOpen) {
      Animated.timing(drawerAnim, {
        toValue: -width * 0.7,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setDrawerOpen(false));
    } else {
      setDrawerOpen(true);
      Animated.timing(drawerAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomeTab />;
      case 'history': return <HistoryTab onNavigateToAiDoctor={() => setActiveTab('aiDoctor')} />;
      case 'map': return <MapTab />;
      case 'profile': return <ProfileTab />;
      case 'report': return <ReportScreen onBack={() => setActiveTab('home')} />;
      case 'aiDoctor': return <AiDoctorAssistantScreen onBack={() => setActiveTab('history')} />;
    }
  };

  if (activeTab === 'report' || activeTab === 'aiDoctor') return renderContent();

  const center = width / 2;
  const curveWidth = 65;
  const curveDepth = 52;
  const smoothness = 32;

  const d = `
    M0,0
    L${center - curveWidth},0
    C${center - curveWidth + smoothness},0
      ${center - curveWidth + smoothness/2},${curveDepth}
      ${center},${curveDepth}
    S${center + curveWidth - smoothness},0
      ${center + curveWidth},0
    L${width},0
    L${width},100
    L0,100
    Z
  `;

  return (
    <View className="flex-1 bg-white">
      <Drawer isOpen={drawerOpen} onClose={toggleDrawer} drawerAnim={drawerAnim} />

      {/* --- Header --- */}
      <View
        style={{
          paddingTop: Platform.OS === 'ios' ? 60 : 45,
          paddingBottom: 16,
          paddingHorizontal: 20,
          backgroundColor: 'white',
          borderBottomWidth: 1,
          borderBottomColor: '#F3F4F6',
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          overflow: 'hidden'
        }}
      >
        <View className="flex-row items-center flex-1">
          <TouchableOpacity 
            onPress={toggleDrawer} 
            activeOpacity={0.6}
            style={{ marginRight: 16, padding: 4 }}
          >
            <Menu size={26} color="#1B365D" strokeWidth={2} />
          </TouchableOpacity>
          
          <Image
            source={require('../assets/logo/logo.png')}
            style={{ width: 100, height: 32, marginLeft: -30}}
            resizeMode="contain"
          />
        </View>

        <View className="flex-row items-center" style={{ gap: 15 }}>
          {/* --- Notification Icon with 99+ Pill Badge --- */}
          <TouchableOpacity className="relative p-1">
            <Bell size={26} color="#1B365D" strokeWidth={2} />
            <View
              style={{
                position: 'absolute',
                top: -2,
                right: -9,
                backgroundColor: '#EF4444', // Vibrant Red
                borderRadius: 10,
                paddingHorizontal: 5,
                paddingVertical: 1,
                minWidth: 30,
                height: 18,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1.5,
                borderColor: 'white'
              }}
            >
              <Text style={{ color: 'white', fontSize: 8, fontWeight: '900' }}>99 +</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => setActiveTab('profile')}
            style={{
                shadowColor: '#1B365D',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 5,
            }}
          >
            {user?.documents?.selfieUrl ? (
              <Image 
                source={{ uri: user.documents.selfieUrl }} 
                style={{ width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: '#F3F4F6' }}
                resizeMode="cover"
              />
            ) : (
              <View className="bg-[#1B365D] rounded-full w-10 h-10 items-center justify-center border-2 border-gray-50">
                <Text className="text-white font-bold" style={{ fontSize: 15 }}>
                  {user?.firstName?.charAt(0) || 'U'}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-1">
        {renderContent()}
      </View>
      
      {/* --- Bottom Navigation --- */}
      <View style={{ position: 'relative', backgroundColor: 'transparent' }}>
        <Svg height="110" width={width} style={{ position: 'absolute', top: 0 }}>
          <Path
            d={d}
            fill="white"
            stroke="#0934755f"
            strokeWidth="1.5"
          />
        </Svg>
        
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: 85,
          paddingBottom: Platform.OS === 'ios' ? 30 : 15
        }}>
          <TouchableOpacity onPress={() => setActiveTab('home')} className="flex-1 items-center">
            <Home size={22} color={activeTab === 'home' ? '#1B365D' : '#9CA3AF'} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
            <Text style={{ color: activeTab === 'home' ? '#1B365D' : '#9CA3AF', fontSize: 10, marginTop: 5, fontWeight: activeTab === 'home' ? '700' : '500' }}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setActiveTab('history')} className="flex-1 items-center">
            <History size={22} color={activeTab === 'history' ? '#1B365D' : '#9CA3AF'} strokeWidth={activeTab === 'history' ? 2.5 : 2} />
            <Text style={{ color: activeTab === 'history' ? '#1B365D' : '#9CA3AF', fontSize: 10, marginTop: 5, fontWeight: activeTab === 'history' ? '700' : '500' }}>History</Text>
          </TouchableOpacity>

          <View style={{ width: 80 }} />

          <TouchableOpacity onPress={() => setActiveTab('map')} className="flex-1 items-center">
            <MapPin size={22} color={activeTab === 'map' ? '#1B365D' : '#9CA3AF'} strokeWidth={activeTab === 'map' ? 2.5 : 2} />
            <Text style={{ color: activeTab === 'map' ? '#1B365D' : '#9CA3AF', fontSize: 10, marginTop: 5, fontWeight: activeTab === 'map' ? '700' : '500' }}>Map</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setActiveTab('profile')} className="flex-1 items-center">
            <User size={22} color={activeTab === 'profile' ? '#1B365D' : '#9CA3AF'} strokeWidth={activeTab === 'profile' ? 2.5 : 2} />
            <Text style={{ color: activeTab === 'profile' ? '#1B365D' : '#9CA3AF', fontSize: 10, marginTop: 5, fontWeight: activeTab === 'profile' ? '700' : '500' }}>Profile</Text>
          </TouchableOpacity>
        </View>

        {/* --- The Deep-Pocket FAB (Modified Shadow & Color) --- */}
        <TouchableOpacity
          onPress={() => setActiveTab('report')}
          activeOpacity={0.8}
          style={{
            position: 'absolute',
            left: width / 2 - 32,
            top: -22,
            zIndex: 60
          }}
        >
          <View
            style={{
              backgroundColor: '#345d97', // Lighter Blue than #1B365D
              width: 60,
              height: 60,
              borderRadius: 32,
              alignItems: 'center',
              justifyContent: 'center',
           
            }}
          >
            <Plus size={29} color="#fff" strokeWidth={3} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};