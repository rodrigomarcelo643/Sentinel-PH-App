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
  const isOutbreak = announcement.type === 'outbreak_alert';
  const formattedDate = announcement.createdAt?.toDate?.();
  const dateStr = formattedDate?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) || 'Recent';
  const timeStr = formattedDate?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) || '';

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

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        {/* News Header */}
        <View style={{ marginBottom: 24 }}>
          {/* Type Badge */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <View style={{ backgroundColor: style.bg, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: style.border, flexDirection: 'row', alignItems: 'center' }}>
              <Icon size={16} color={style.border} strokeWidth={2.5} />
              <Text style={{ fontSize: 13, fontWeight: '700', color: style.border, marginLeft: 6, letterSpacing: 0.3 }}>{isOutbreak ? 'OUTBREAK' : style.label.toUpperCase()}</Text>
            </View>
          </View>

          {/* Title */}
          <Text style={{ fontSize: 28, fontWeight: '800', color: '#111827', marginBottom: 20, lineHeight: 36, fontFamily: 'Inter-SemiBold' }}>{announcement.title}</Text>

          {/* Meta Information */}
          <View style={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#E5E7EB', paddingVertical: 12,  }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <User size={18} color="#1B365D" strokeWidth={2} />
              <Text style={{ fontSize: 15, color: '#1F2937', marginLeft: 8, fontWeight: '600' }}>Posted by {announcement.createdBy}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Calendar size={18} color="#6B7280" strokeWidth={2} />
              <Text style={{ fontSize: 14, color: '#6B7280', marginLeft: 8 }}>{dateStr} at {timeStr}</Text>
            </View>
          </View>
        </View>

        {/* Article Content */}
        <View style={{ backgroundColor: 'white', borderRadius: 2, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 }}>
          <Text style={{ fontSize: 17, color: '#374151', lineHeight: 28, fontFamily: 'Inter-Medium' }}>{announcement.message}</Text>
        </View>

        {/* Footer Divider */}
        <View style={{ marginTop: 24, paddingTop: 20, borderTopWidth: 1, borderColor: '#E5E7EB' }}>
          <Text style={{ fontSize: 12, color: '#9CA3AF', textAlign: 'center', fontStyle: 'italic' }}>End of announcement</Text>
        </View>
      </ScrollView>
    </View>
  );
};
