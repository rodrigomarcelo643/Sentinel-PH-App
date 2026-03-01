import { View, Text, TouchableOpacity, ScrollView, Platform, StatusBar } from 'react-native';
import { ArrowLeft, AlertTriangle, Heart, Package, Droplet, Syringe, Info } from 'lucide-react-native';
import { useAnnouncements } from '../context/AnnouncementContext';
import { Announcement } from '../services/announcements';

interface AnnouncementsScreenProps {
  onBack: () => void;
  onSelectAnnouncement: (announcement: Announcement) => void;
}

const getAnnouncementStyle = (type: string) => {
  switch (type) {
    case 'health_advisory':
      return { border: '#10B981', bg: '#D1FAE5', icon: Heart };
    case 'outbreak_alert':
      return { border: '#EF4444', bg: '#FEE2E2', icon: AlertTriangle };
    case 'medical_supplies':
      return { border: '#3B82F6', bg: '#DBEAFE', icon: Package };
    case 'water_advisory':
      return { border: '#06B6D4', bg: '#CFFAFE', icon: Droplet };
    case 'vaccination_drive':
      return { border: '#8B5CF6', bg: '#EDE9FE', icon: Syringe };
    default:
      return { border: '#6B7280', bg: '#F3F4F6', icon: Info };
  }
};

export const AnnouncementsScreen = ({ onBack, onSelectAnnouncement }: AnnouncementsScreenProps) => {
  const { announcements, readAnnouncements } = useAnnouncements();

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <View style={{ paddingTop: (StatusBar.currentHeight || 0) + 20, paddingHorizontal: 20, paddingBottom: 12, backgroundColor: '#1B365D' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={onBack} style={{ marginRight: 16 }}>
            <ArrowLeft size={24} color="white" strokeWidth={2} />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: '700', color: 'white', fontFamily: 'Inter-SemiBold' }}>BHW Announcements</Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        {announcements.map((announcement) => {
          const style = getAnnouncementStyle(announcement.type);
          const Icon = style.icon;
          const isUnread = !readAnnouncements.includes(announcement.id);

          return (
            <TouchableOpacity
              key={announcement.id}
              onPress={() => onSelectAnnouncement(announcement)}
              style={{ backgroundColor: 'white', borderLeftWidth: 4, borderLeftColor: style.border, borderRadius: 2, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                {isUnread && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: style.border, marginRight: 12, marginTop: 6 }} />}
                <Icon size={24} color={style.border} strokeWidth={2} style={{ marginRight: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 4 }} numberOfLines={1}>{announcement.title}</Text>
                  <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 8 }} numberOfLines={2}>{announcement.message}</Text>
                  <Text style={{ fontSize: 12, color: '#9CA3AF' }}>
                    {announcement.createdAt?.toDate?.()?.toLocaleDateString() || 'Recent'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};
