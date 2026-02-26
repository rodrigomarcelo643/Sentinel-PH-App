import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context';
import { Mail, Phone, MapPin, FileText, Camera, LogOut, CheckCircle, Shield } from 'lucide-react-native';

export const ProfileTab = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const getStatusColor = () => {
    switch(user?.status) {
      case 'approved': return { bg: '#DCFCE7', text: '#16A34A' };
      case 'pending': return { bg: '#FEF3C7', text: '#D97706' };
      case 'rejected': return { bg: '#FEE2E2', text: '#DC2626' };
      default: return { bg: '#F3F4F6', text: '#6B7280' };
    }
  };

  const statusColors = getStatusColor();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      {/* Header */}
      <View style={{ backgroundColor: '#1B365D', paddingTop: 60, paddingBottom: 40, paddingHorizontal: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
        <View style={{ alignItems: 'center' }}>
          {user?.documents?.selfieUrl ? (
            <Image 
              source={{ uri: user.documents.selfieUrl }} 
              style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: 'white', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 5 }}
              resizeMode="cover"
            />
          ) : (
            <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 5 }}>
              <Text style={{ fontSize: 40, fontWeight: 'bold', color: '#1B365D', fontFamily: 'Inter-SemiBold' }}>
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </Text>
            </View>
          )}
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white', fontFamily: 'Inter-SemiBold', textAlign: 'center' }}>
            {user?.firstName} {user?.middleInitial}. {user?.lastName}
          </Text>
          <View style={{ backgroundColor: statusColors.bg, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            {user?.status === 'approved' && <CheckCircle size={14} color={statusColors.text} strokeWidth={2.5} />}
            <Text style={{ color: statusColors.text, fontSize: 13, fontWeight: '700', fontFamily: 'Inter-SemiBold' }}>
              {user?.status === 'approved' ? 'VERIFIED' : user?.status?.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      <View style={{ padding: 20, marginTop: -20 }}>
        {/* Personal Details */}
        <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Shield size={20} color="#1B365D" strokeWidth={2} />
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1B365D', marginLeft: 8, fontFamily: 'Inter-SemiBold' }}>Personal Details</Text>
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' }}>
              <Mail size={18} color="#3B82F6" strokeWidth={2} />
            </View>
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'Inter-Medium', marginBottom: 2 }}>Email Address</Text>
              <Text style={{ fontSize: 14, color: '#1F2937', fontFamily: 'Inter-SemiBold' }}>{user?.email}</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0FDF4', alignItems: 'center', justifyContent: 'center' }}>
              <Phone size={18} color="#16A34A" strokeWidth={2} />
            </View>
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'Inter-Medium', marginBottom: 2 }}>Contact Number</Text>
              <Text style={{ fontSize: 14, color: '#1F2937', fontFamily: 'Inter-SemiBold' }}>{user?.contactNumber}</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'flex-start', paddingTop: 12 }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#FEF3C7', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={18} color="#D97706" strokeWidth={2} />
            </View>
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'Inter-Medium', marginBottom: 2 }}>Address</Text>
              <Text style={{ fontSize: 14, color: '#1F2937', fontFamily: 'Inter-SemiBold' }}>
                {user?.address?.barangay}, {user?.address?.municipality}
              </Text>
              <Text style={{ fontSize: 13, color: '#6B7280', fontFamily: 'Inter-Medium', marginTop: 2 }}>
                {user?.address?.region}
              </Text>
            </View>
          </View>
        </View>

        {/* Verified Documents */}
        <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <FileText size={20} color="#1B365D" strokeWidth={2} />
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1B365D', marginLeft: 8, fontFamily: 'Inter-SemiBold' }}>Verified Documents</Text>
          </View>
          
          <View style={{ backgroundColor: '#F9FAFB', borderRadius: 12, padding: 12, marginBottom: 16 }}>
            <Text style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'Inter-Medium', marginBottom: 4 }}>ID Type</Text>
            <Text style={{ fontSize: 14, color: '#1F2937', fontFamily: 'Inter-SemiBold' }}>{user?.documents?.idType}</Text>
          </View>

          {user?.documents?.validIdUrl && (
            <View style={{ marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <FileText size={16} color="#6B7280" strokeWidth={2} />
                <Text style={{ fontSize: 12, color: '#6B7280', marginLeft: 6, fontFamily: 'Inter-SemiBold' }}>Valid ID</Text>
              </View>
              <Image 
                source={{ uri: user.documents.validIdUrl }} 
                style={{ width: '100%', height: 160, borderRadius: 12, backgroundColor: '#F3F4F6' }}
                resizeMode="cover"
              />
            </View>
          )}

          {user?.documents?.selfieUrl && (
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Camera size={16} color="#6B7280" strokeWidth={2} />
                <Text style={{ fontSize: 12, color: '#6B7280', marginLeft: 6, fontFamily: 'Inter-SemiBold' }}>Selfie with ID</Text>
              </View>
              <Image 
                source={{ uri: user.documents.selfieUrl }} 
                style={{ width: '100%', height: 160, borderRadius: 12, backgroundColor: '#F3F4F6' }}
                resizeMode="cover"
              />
            </View>
          )}
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          onPress={handleLogout}
          style={{ backgroundColor: '#DC2626', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', shadowColor: '#DC2626', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 3, marginBottom: 20 }}
        >
          <LogOut size={20} color="white" strokeWidth={2} />
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '700', marginLeft: 8, fontFamily: 'Inter-SemiBold' }}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
