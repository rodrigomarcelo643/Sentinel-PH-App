import { View, Text, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { ArrowLeft, AlertTriangle, Heart, Package, Droplet, Syringe, Info, Calendar, User } from 'lucide-react-native';
import { useEffect } from 'react';
import { Announcement } from '../services/announcements';
import { useAnnouncements } from '../context/AnnouncementContext';

interface AnnouncementDetailScreenProps {
  announcement: Announcement;
  onBack: () => void;
}

const getAnnouncementStyle = (type: string) => {
  switch (type) {
    case 'health_advisory':
      return { border: '#10B981', bg: '#D1FAE5', icon: Heart, label: 'Health Advisory' };
    case 'outbreak_alert':
      return { border: '#EF4444', bg: '#FEE2E2', icon: AlertTriangle, label: 'Outbreak Alert' };
    case 'medical_supplies':
      return { border: '#3B82F6', bg: '#DBEAFE', icon: Package, label: 'Medical Supplies' };
    case 'water_advisory':
      return { border: '#06B6D4', bg: '#CFFAFE', icon: Droplet, label: 'Water Advisory' };
    case 'vaccination_drive':
      return { border: '#8B5CF6', bg: '#EDE9FE', icon: Syringe, label: 'Vaccination Drive' };
    default:
      return { border: '#6B7280', bg: '#F3F4F6', icon: Info, label: 'General' };
  }
};

export const AnnouncementDetailScreen = ({ announcement, onBack }: AnnouncementDetailScreenProps) => {
  const { markAsRead } = useAnnouncements();
  const style = getAnnouncementStyle(announcement.type);
  const Icon = style.icon;

  useEffect(() => {
    markAsRead(announcement.id);
  }, [announcement.id]);

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <View style={{ paddingTop: (StatusBar.currentHeight || 0) + 20, paddingHorizontal: 20, paddingBottom: 12, backgroundColor: '#1B365D' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={onBack} style={{ marginRight: 16 }}>
            <ArrowLeft size={24} color="white" strokeWidth={2} />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: '700', color: 'white', fontFamily: 'Inter-SemiBold' }}>Announcement Details</Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        {/* Type Badge */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <Icon size={20} color={style.border} strokeWidth={2} />
          <View style={{ backgroundColor: style.bg, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 6, marginLeft: 8, borderWidth: 1, borderColor: style.border }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: style.border }}>{style.label}</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={{ fontSize: 24, fontWeight: '800', color: '#1F2937', marginBottom: 16, lineHeight: 30 }}>{announcement.title}</Text>

        {/* Message */}
        <View style={{ backgroundColor: 'white', borderRadius: 8, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 }}>
          <Text style={{ fontSize: 16, color: '#374151', lineHeight: 24 }}>{announcement.message}</Text>
        </View>

        {/* Metadata */}
        <View style={{ backgroundColor: 'white', borderRadius: 8, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Calendar size={16} color="#6B7280" strokeWidth={2} />
            <Text style={{ fontSize: 14, color: '#6B7280', marginLeft: 8, fontWeight: '500' }}>Published</Text>
          </View>
          <Text style={{ fontSize: 15, color: '#1F2937', marginBottom: 16, fontWeight: '600' }}>
            {announcement.createdAt?.toDate?.()?.toLocaleString() || 'Recent'}
          </Text>
          
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <User size={16} color="#6B7280" strokeWidth={2} />
            <Text style={{ fontSize: 14, color: '#6B7280', marginLeft: 8, fontWeight: '500' }}>Posted by</Text>
          </View>
          <Text style={{ fontSize: 15, color: '#1F2937', fontWeight: '600' }}>{announcement.createdBy}</Text>
        </View>
      </ScrollView>
    </View>
  );
};
