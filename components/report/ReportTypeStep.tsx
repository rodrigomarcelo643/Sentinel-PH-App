import { View, Text, TouchableOpacity } from 'react-native';
import { User, Eye } from 'lucide-react-native';

interface ReportTypeStepProps {
  reportType: 'self' | 'observed' | null;
  onSelect: (type: 'self' | 'observed') => void;
}

export const ReportTypeStep = ({ reportType, onSelect }: ReportTypeStepProps) => {
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1B365D', marginBottom: 8, fontFamily: 'Inter-SemiBold' }}>
        Report Type
      </Text>
      <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 24, fontFamily: 'Inter-Medium' }}>
        Are you reporting your own symptoms or someone else's?
      </Text>

      <TouchableOpacity
        onPress={() => onSelect('self')}
        style={{
          backgroundColor: reportType === 'self' ? '#EFF6FF' : 'white',
          borderWidth: 2,
          borderColor: reportType === 'self' ? '#1B365D' : '#E5E7EB',
          borderRadius: 16,
          padding: 20,
          marginBottom: 16,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: reportType === 'self' ? '#1B365D' : '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
          <User size={24} color={reportType === 'self' ? 'white' : '#6B7280'} strokeWidth={2} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1B365D', fontFamily: 'Inter-SemiBold' }}>
            My Symptoms
          </Text>
          <Text style={{ fontSize: 13, color: '#6B7280', marginTop: 4, fontFamily: 'Inter-Medium' }}>
            I'm experiencing symptoms myself
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onSelect('observed')}
        style={{
          backgroundColor: reportType === 'observed' ? '#EFF6FF' : 'white',
          borderWidth: 2,
          borderColor: reportType === 'observed' ? '#1B365D' : '#E5E7EB',
          borderRadius: 16,
          padding: 20,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: reportType === 'observed' ? '#1B365D' : '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
          <Eye size={24} color={reportType === 'observed' ? 'white' : '#6B7280'} strokeWidth={2} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1B365D', fontFamily: 'Inter-SemiBold' }}>
            Observed Symptoms
          </Text>
          <Text style={{ fontSize: 13, color: '#6B7280', marginTop: 4, fontFamily: 'Inter-Medium' }}>
            Someone in my community is showing symptoms
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
