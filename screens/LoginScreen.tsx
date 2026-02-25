import { View, Text, Image, TouchableOpacity, TextInput, Animated } from 'react-native';
import { Input, Button } from '../components/ui';
import { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react-native';

interface LoginScreenProps {
  onNavigateToRegister: () => void;
}

export const LoginScreen = ({ onNavigateToRegister }: LoginScreenProps) => {
  const [contactNumber, setContactNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      setContactNumber(cleaned.substring(1));
    } else if (cleaned.length <= 10) {
      setContactNumber(cleaned);
    }
  };

  const handleLogin = () => {
    console.log('Login:', '+63' + contactNumber, password);
  };

  const handleForgotPassword = () => {
    console.log('Forgot password');
  };

  const handleRegister = () => {
    onNavigateToRegister();
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
        <View className="mb-3">
         
          <View className="flex-row items-center rounded-xl border-2 border-gray-300 bg-white px-4">
            <Text className="mr-2 text-2xl">🇵🇭</Text>
            <Text
              className="mr-2 font-medium text-base text-gray-300"
              style={{ fontFamily: 'Inter-Medium' }}>
              +63 | 
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
        <Input
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          icon={<Lock size={20} color="#6b7280" />}
          rightIcon={
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <Eye size={20} color="#6b7280" />
              ) : (
                <EyeOff size={20} color="#6b7280" />
              )}
            </TouchableOpacity>
          }
        />
        <Button
          variant="primary"
          size="lg"
          onPress={handleLogin}
          className="mt-6"
          disabled={contactNumber.length !== 10}>
          Sign In
        </Button>
        <TouchableOpacity onPress={handleForgotPassword} className="mt-6 items-center">
          <Text
            className="font-semibold text-lg text-[#1B365D]"
            style={{ textDecorationLine: 'underline' , marginTop: 10}}>
            Forgot Password?
          </Text>
        </TouchableOpacity>
        <View className="mt-6 flex-row items-center justify-center" style={{ marginTop: 15 }}>
          <Text className="text-lg text-gray-600"   style={{ fontFamily: 'Inter-Medium' }}>Become a Sentinel? </Text>
          <TouchableOpacity onPress={handleRegister} >
            <Text
              className="font-semibold text-lg text-[#1B365D]"
              style={{ textDecorationLine: 'underline' }}>
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};
