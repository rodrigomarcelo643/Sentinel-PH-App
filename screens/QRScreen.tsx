import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useAuth } from '../context/AuthContext';
import { generateUserQRCode, getUserQRCode } from '../services/qrCode';
import { ArrowLeft, RefreshCw, User, Phone, MapPin, Shield, FileText } from 'lucide-react-native';

interface QRScreenProps {
  navigation: {
    goBack: () => void;
  };
}

export const QRScreen: React.FC<QRScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const [qrData, setQrData] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    loadQRCode();
  }, [user]);

  const loadQRCode = async () => {
    if (!user?.uid) return;
    
    try {
      setLoading(true);
      let qrCode = await getUserQRCode(user.uid);
      
      if (!qrCode) {
        qrCode = await generateUserQRCode(user.uid, user);
      }
      
      if (qrCode) {
        setQrData(qrCode.qrId);
      }
    } catch (error) {
      console.error('Error loading QR code:', error);
      Alert.alert('Error', 'Failed to load QR code');
    } finally {
      setLoading(false);
    }
  };

  const regenerateQRCode = async () => {
    if (!user?.uid) return;
    
    try {
      setRegenerating(true);
      const newQRCode = await generateUserQRCode(user.uid, user);
      if (newQRCode) {
        setQrData(newQRCode.qrId);
        Alert.alert('Success', 'QR code has been regenerated');
      }
    } catch (error) {
      console.error('Error regenerating QR code:', error);
      Alert.alert('Error', 'Failed to regenerate QR code');
    } finally {
      setRegenerating(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1B365D" />
        <Text style={styles.loadingText}>Loading your QR code...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color="#1B365D" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My QR Code</Text>
        <TouchableOpacity 
          style={styles.regenerateButton}
          onPress={regenerateQRCode}
          disabled={regenerating}
        >
          <RefreshCw size={20} color={regenerating ? "#ccc" : "#1B365D"} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.qrContainer}>
          <Text style={styles.sectionTitle}>Your Health QR Code</Text>
          <View style={styles.qrCodeWrapper}>
            {qrData ? (
              <QRCode
                value={qrData}
                size={220}
                color="#1B365D"
                backgroundColor="#ffffff"
              />
            ) : (
              <View style={styles.noQRContainer}>
                <Text style={styles.noQRText}>No QR code available</Text>
              </View>
            )}
          </View>
          <View style={styles.qrIdContainer}>
            <Text style={styles.qrIdLabel}>QR ID</Text>
            <Text style={styles.qrIdText}>{qrData}</Text>
          </View>
        </View>

        <View style={styles.userInfoContainer}>
          <Text style={styles.sectionTitle}>Profile Information</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <User size={18} color="#1B365D" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>{user?.firstName} {user?.middleInitial}. {user?.lastName}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Phone size={18} color="#1B365D" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Contact Number</Text>
              <Text style={styles.infoValue}>{user?.contactNumber}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <MapPin size={18} color="#1B365D" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoValue}>{user?.address?.barangay}, {user?.address?.municipality}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Shield size={18} color="#1B365D" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Community Role</Text>
              <Text style={styles.infoValue}>{user?.communityRole || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <FileText size={18} color="#1B365D" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>ID Type</Text>
              <Text style={styles.infoValue}>{user?.documents?.idType}</Text>
            </View>
          </View>
        </View>

        <View style={styles.warningContainer}>
          <Text style={styles.warningTitle}>⚠️ Security Notice</Text>
          <Text style={styles.warningText}>
            This QR code contains your personal health information. Only share with authorized health officials and medical personnel.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#1B365D',
    fontFamily: 'Inter-Medium',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingTop: 50,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B365D',
    fontFamily: 'Inter-SemiBold',
  },
  regenerateButton: {
    padding: 5,
  },
  content: {
    padding: 20,
  },
  qrContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 24,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B365D',
    marginBottom: 16,
    fontFamily: 'Inter-SemiBold',
  },
  qrCodeWrapper: {
    padding: 16,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 4,
  },
  noQRContainer: {
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  noQRText: {
    color: '#6B7280',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  qrIdContainer: {
    marginTop: 16,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  qrIdLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 2,
    fontFamily: 'Inter-Medium',
  },
  qrIdText: {
    fontSize: 12,
    color: '#1B365D',
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  userInfoContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 4,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 2,
    fontFamily: 'Inter-Medium',
  },
  infoValue: {
    fontSize: 14,
    color: '#1F2937',
    fontFamily: 'Inter-SemiBold',
  },
  warningContainer: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 8,
    fontFamily: 'Inter-SemiBold',
  },
  warningText: {
    fontSize: 12,
    color: '#78350F',
    lineHeight: 18,
    fontFamily: 'Inter-Medium',
  },
});