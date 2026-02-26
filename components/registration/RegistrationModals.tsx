import { View, Text, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { IDScannerCamera } from '../camera/IDScannerCamera';
import { SelfieCamera } from '../camera/SelfieCamera';

interface RegistrationModalsProps {
  showIdScanner: boolean;
  setShowIdScanner: (value: boolean) => void;
  setValidId: (value: string) => void;
  showSelfieCamera: boolean;
  setShowSelfieCamera: (value: boolean) => void;
  setSelfie: (value: string) => void;
  isRegistering: boolean;
  showSuccessModal: boolean;
  setShowSuccessModal: (value: boolean) => void;
  onNavigateToLogin: () => void;
}

export const RegistrationModals = ({
  showIdScanner,
  setShowIdScanner,
  setValidId,
  showSelfieCamera,
  setShowSelfieCamera,
  setSelfie,
  isRegistering,
  showSuccessModal,
  setShowSuccessModal,
  onNavigateToLogin,
}: RegistrationModalsProps) => {
  return (
    <>
      <Modal visible={showIdScanner} animationType="slide" presentationStyle="fullScreen">
        <IDScannerCamera
          onCapture={(uri) => {
            setValidId(uri);
            setShowIdScanner(false);
          }}
          onClose={() => setShowIdScanner(false)}
        />
      </Modal>

      <Modal visible={showSelfieCamera} animationType="slide" presentationStyle="fullScreen">
        <SelfieCamera
          onCapture={(uri) => {
            setSelfie(uri);
            setShowSelfieCamera(false);
          }}
          onClose={() => setShowSelfieCamera(false)}
        />
      </Modal>

      <Modal visible={isRegistering} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 32, alignItems: 'center', width: 280 }}>
            <ActivityIndicator size="large" color="#1B365D" />
            <Text style={{ color: '#1B365D', fontSize: 18, fontWeight: '600', textAlign: 'center', fontFamily: 'Inter-SemiBold', marginTop: 24, marginBottom: 8 }}>
              Registering...
            </Text>
            <Text style={{ color: '#6b7280', fontSize: 14, textAlign: 'center', fontFamily: 'Inter-Medium' }}>
              Please wait
            </Text>
          </View>
        </View>
      </Modal>

      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 32, alignItems: 'center', width: '100%', maxWidth: 320 }}>
            <View style={{ backgroundColor: '#dcfce7', borderRadius: 9999, padding: 16, marginBottom: 24 }}>
              <Text style={{ color: '#16a34a', fontSize: 36 }}>✓</Text>
            </View>
            <Text style={{ color: '#1B365D', fontSize: 20, fontWeight: '600', textAlign: 'center', fontFamily: 'Inter-SemiBold', marginBottom: 12 }}>
              Registration Successful!
            </Text>
            <Text style={{ color: '#6b7280', fontSize: 16, textAlign: 'center', fontFamily: 'Inter-Medium', marginBottom: 24 }}>
              Please wait for updates regarding the approval of your account.
            </Text>
            <TouchableOpacity
              onPress={() => {
                setShowSuccessModal(false);
                onNavigateToLogin();
              }}
              style={{ backgroundColor: '#1B365D', width: '100%', paddingVertical: 16, borderRadius: 12 }}
            >
              <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600', fontSize: 16, fontFamily: 'Inter-SemiBold' }}>
                Go to Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};
