import { View, Text, TouchableOpacity, Animated, Modal, Dimensions } from 'react-native';
import { useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { X, AlertTriangle, Heart, Package, Droplet, Syringe, Info } from 'lucide-react-native';
import { Announcement } from '../../services/announcements';

const { width } = Dimensions.get('window');

interface AnnouncementNotificationProps {
  announcement: Announcement | null;
  visible: boolean;
  onClose: () => void;
  onPress: () => void;
}

const getAnnouncementStyle = (type: string) => {
  switch (type) {
    case 'health_advisory':
      return { border: '#10B981', bg: '#D1FAE5', icon: Heart, title: 'BHW Health Advisory' };
    case 'outbreak_alert':
      return { border: '#EF4444', bg: '#FEE2E2', icon: AlertTriangle, title: 'BHW Outbreak Alert' };
    case 'medical_supplies':
      return { border: '#3B82F6', bg: '#DBEAFE', icon: Package, title: 'BHW Medical Update' };
    case 'water_advisory':
      return { border: '#06B6D4', bg: '#CFFAFE', icon: Droplet, title: 'BHW Water Advisory' };
    case 'vaccination_drive':
      return { border: '#8B5CF6', bg: '#EDE9FE', icon: Syringe, title: 'BHW Vaccination Drive' };
    default:
      return { border: '#6B7280', bg: '#F3F4F6', icon: Info, title: 'BHW Alert' };
  }
};

export const AnnouncementNotification = ({ announcement, visible, onClose, onPress }: AnnouncementNotificationProps) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    if (visible && announcement) {
      // Play alert sound only for outbreak alerts
      if (announcement.type === 'outbreak_alert') {
        playAlertSound();
      }
      
      Animated.spring(slideAnim, { 
        toValue: 0, 
        useNativeDriver: true, 
        tension: 50,
        friction: 8
      }).start();
    } else {
      // Stop sound when notification is closed
      stopAlertSound();
      
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true
      }).start();
    }
  }, [visible, announcement]);

  const playAlertSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/alert_sounds/wireless_emergency_alert.mp3')
      );
      soundRef.current = sound;
      await sound.playAsync();
      
      // Auto-cleanup when sound finishes
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
          soundRef.current = null;
        }
      });
    } catch (error) {
      console.log('Error playing alert sound:', error);
    }
  };

  const stopAlertSound = async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      } catch (error) {
        console.log('Error stopping alert sound:', error);
      }
    }
  };

  if (!announcement) return null;
  
  const style = getAnnouncementStyle(announcement.type);
  const Icon = style.icon;

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'flex-start', paddingTop: 60 }}>
        <Animated.View style={{ transform: [{ translateY: slideAnim }], marginHorizontal: 16 }}>
          <TouchableOpacity onPress={() => {
            stopAlertSound();
            onPress();
          }} activeOpacity={0.9}>
            <View style={{ 
              backgroundColor: style.bg, 
              borderLeftWidth: 6, 
              borderLeftColor: style.border, 
              borderRadius: 2, 
              padding: 20, 
              shadowColor: '#000', 
              shadowOffset: { width: 0, height: 8 }, 
              shadowOpacity: 0.4, 
              shadowRadius: 12, 
              elevation: 12,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.8)'
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <Icon size={28} color={style.border} strokeWidth={2.5} />
                  <View style={{ marginLeft: 16, flex: 1 }}>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: style.border, marginBottom: 4, letterSpacing: 0.5 }}>{style.title}</Text>
                    <Text style={{ fontSize: 18, fontWeight: '800', color: '#1F2937', marginBottom: 8, lineHeight: 22 }} numberOfLines={2}>{announcement.title}</Text>
                    <Text style={{ fontSize: 15, color: '#4B5563', lineHeight: 20 }} numberOfLines={3}>{announcement.message}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => {
                  stopAlertSound();
                  onClose();
                }} style={{ padding: 8, marginLeft: 8 }}>
                  <X size={24} color="#6B7280" strokeWidth={2} />
                </TouchableOpacity>
              </View>
              <View style={{ marginTop: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.1)' }}>
                <Text style={{ fontSize: 12, color: '#9CA3AF', textAlign: 'center' }}>Tap to view details • Auto-closes in 30s</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};
