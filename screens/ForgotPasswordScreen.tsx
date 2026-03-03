import { View, Text, Image, TouchableOpacity, TextInput, Animated, Modal, ActivityIndicator } from 'react-native';
import { Button } from '../components/ui';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface ForgotPasswordScreenProps {
  onNavigateBack: () => void;
}

export const ForgotPasswordScreen = ({ onNavigateBack }: ForgotPasswordScreenProps) => {
  const [contactNumber, setContactNumber] = useState('');
  const [showSendingModal, setShowSendingModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleContactChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.startsWith('0')) {
      setContactNumber(cleaned.substring(1, 11));
    } else if (cleaned.length <= 10) {
      setContactNumber(cleaned);
    }
  };

  const handleResetPassword = async () => {
    if (contactNumber.length !== 10) {
      setErrorMessage('Please enter a valid 11-digit contact number');
      setShowErrorModal(true);
      return;
    }

    setShowSendingModal(true);
    try {
      const formattedPhone = `0${contactNumber}`;
      const q = query(collection(db, 'users'), where('contactNumber', '==', formattedPhone));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setShowSendingModal(false);
        setErrorMessage('No account found with this contact number');
        setShowErrorModal(true);
        return;
      }

      const userData = snapshot.docs[0].data();
      await sendPasswordResetEmail(auth, userData.email);

      setTimeout(() => {
        setShowSendingModal(false);
        setShowSuccessModal(true);
      }, 500);
    } catch (error: any) {
      setShowSendingModal(false);
      setErrorMessage(error.message || 'Failed to send reset email');
      setShowErrorModal(true);
    }
  };

  return (
    <View className="flex-1 justify-center bg-white px-6">
      <Animated.View 
        className="mb-4 items-center"
        style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
      >
        <Image
          source={require('../assets/logo/logo.png')}
          style={{ width: 200, height: 200 }}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.View 
        style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
      >
        <Text 
          className="text-2xl font-semibold text-[#1B365D] mb-2 text-center"
          style={{ fontFamily: 'Inter-SemiBold' }}
        >
          Forgot Password?
        </Text>
        <Text 
          className="text-base text-gray-600 mb-6 text-center"
          style={{ fontFamily: 'Inter-Medium' }}
        >
          Enter your contact number and we'll send you a password reset link
        </Text>

        <View className="mb-6">
          <View className="flex-row items-center rounded-xl border-2 border-gray-300 bg-white px-4">
            <Text className="mr-2 text-2xl">🇵🇭</Text>
            <Text
              className="mr-2 font-medium text-base text-gray-500"
              style={{ fontFamily: 'Inter-Medium' }}>
              +63 
            </Text>
            <View className="mr-2 h-6 w-px bg-gray-300" />
            <TextInput
              className="flex-1 text-base text-gray-800"
              style={{ paddingVertical: 16, fontFamily: 'Inter-Medium' }}
              placeholder="9XX XXX XXXX"
              value={contactNumber}
              onChangeText={handleContactChange}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>
        </View>

        <Button
          variant="primary"
          size="lg"
          onPress={handleResetPassword}
          className="mt-2">
          Send Reset Link
        </Button>

        <TouchableOpacity onPress={onNavigateBack} className="mt-6 flex-row items-center justify-center">
          <ArrowLeft size={20} color="#1B365D" />
          <Text
            className="ml-2 font-semibold text-lg text-[#1B365D]"
            style={{ fontFamily: 'Inter-SemiBold' }}>
            Back to Login
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <Modal visible={showSendingModal} transparent animationType="fade">
        <View className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View className="bg-white rounded-2xl p-8 items-center" style={{ width: 280 }}>
            <ActivityIndicator size="large" color="#1B365D" />
            <Text className="text-lg font-semibold text-[#1B365D] mt-4" style={{ fontFamily: 'Inter-SemiBold' }}>
              Sending...
            </Text>
            <Text className="text-sm text-gray-600 mt-2 text-center" style={{ fontFamily: 'Inter-Medium' }}>
              Please wait
            </Text>
          </View>
        </View>
      </Modal>

      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View className="flex-1 justify-center items-center px-6" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View className="bg-white rounded-2xl items-center" style={{ width: '100%', maxWidth: 320, padding: 10, borderRadius: 10 }}>
            <View className="bg-green-100 rounded-full p-4 mb-4">
              <CheckCircle size={48} color="#10B981" />
            </View>
            <Text className="text-xl font-semibold text-[#1B365D] mb-2" style={{ fontFamily: 'Inter-SemiBold' }}>
              Email Sent!
            </Text>
            <Text className="text-sm text-gray-600 text-center mb-6" style={{ fontFamily: 'Inter-Medium' }}>
              Check your email for the password reset link
            </Text>
            <Button 
              variant="primary" 
              size="lg" 
              onPress={() => {
                setShowSuccessModal(false);
                onNavigateBack();
              }}
              style={{ width: '100%' }}
            >
              Back to Login
            </Button>
          </View>
        </View>
      </Modal>

      <Modal visible={showErrorModal} transparent animationType="fade">
        <View className="flex-1 justify-center items-center px-6" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View className="bg-white rounded-2xl items-center" style={{ width: '100%', maxWidth: 320, padding: 10, borderRadius: 10 }}>
            <View className="bg-red-100 rounded-full p-4 mb-4">
              <Mail size={48} color="#EF4444" />
            </View>
            <Text className="text-xl font-semibold text-[#1B365D] mb-2" style={{ fontFamily: 'Inter-SemiBold' }}>
              Error
            </Text>
            <Text className="text-sm text-gray-600 text-center mb-6" style={{ fontFamily: 'Inter-Medium' }}>
              {errorMessage}
            </Text>
            <Button 
              variant="primary" 
              size="lg" 
              onPress={() => setShowErrorModal(false)}
              style={{ width: '100%' }}
            >
              Try Again
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};
